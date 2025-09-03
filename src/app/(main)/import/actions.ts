// app/(main)/import/actions.ts
"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { load as loadHtml } from "cheerio";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uniqueRecipeSlug } from "@/lib/uniqueSlug";
import he from "he";
import { isDenylisted } from "@/lib/denylist";

// -----------------------------
// Config (ENV + sensible defaults)
// -----------------------------
const IMPORTER_USER_AGENT =
  process.env.IMPORTER_USER_AGENT ??
  "CiboLibroBot/0.1 (+https://cibolibro.com; contact support@cibolibro.com)";

const IMPORTER_TIMEOUT_MS = Number(process.env.IMPORTER_TIMEOUT_MS ?? 7000);

// Keep at most 200KB of raw HTML for debug, purge later via cron
const RAW_HTML_MAX = 200_000;

// -----------------------------
// Input validation (Zod)
// -----------------------------
const ImportSchema = z.object({
  url: z
    .url("Please enter a valid URL.")
    .max(2000, "URL is too long.")
    .refine((u) => /^https?:\/\//i.test(u), "Only http(s) URLs are allowed."),
  // Honeypot (bot trap). Must be absent/empty.
  website: z.string().optional().refine((v) => !v, "Bot detected"),
});

const LinkRecipeSchema = z.object({
  url: z.url().max(2000),
  title: z.string().min(2).max(120),
  image: z.url().max(2000).optional().or(z.literal("")).transform(v => v || undefined),
  tags: z.string().max(200).optional(), // comma list, optional
});

type StructuredRecipe = {
  title: string;
  description?: string;
  image?: string; // external URL only
  ingredients?: string[];
  instructions?: string[];
  servings?: number;
  prepMins?: number | null;
  cookMins?: number | null;
  tags?: string[];
  author?: string;
};

// -----------------------------
// Public server action
// -----------------------------
export async function importRecipe(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    // You can also throw a redirect to /signin with a returnTo param if you like
    throw new Error("You must be signed in to import recipes.");
  }
  const userId = session.user.id;

  // Parse inputs
  const payload = {
    url: (formData.get("url") || "").toString().trim(),
    website: (formData.get("website") || "").toString().trim(), // honeypot
  };

  const parsed = ImportSchema.safeParse(payload);
  if (!parsed.success) {
    // In a more advanced UX, you'd surface these errors in the UI
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const url = new URL(parsed.data.url);
  const hostname = url.hostname.toLowerCase();

  // Create ImportJob (PENDING)
  const job = await prisma.importJob.create({
    data: {
      userId: userId,
      sourceUrl: url.toString()
    },
    select: { id: true },
  });

  if (isDenylisted(hostname)) {
    await prisma.importJob.update({
      where: { id: job.id },
      data: { status: 'FAILED', errorMsg: 'DENYLISTED' },
    });
    return redirect(buildPromptUrl(url, undefined, "DENYLISTED"));
  }

  // Compliance: respect robots.txt (conservative)
  const robots = await checkRobotsAllowed(url, IMPORTER_TIMEOUT_MS);

  if (!robots.allowed) {
    await prisma.importJob.update({
      where: { id: job.id },
      data: { status: 'FAILED', errorMsg: 'ROBOTS_BLOCKED' },
    });
    return redirect(buildPromptUrl(url, undefined, "ROBOTS_BLOCKED"));
  }

  // Try fetching the page (polite UA, timeout)
  const { ok, status, html, og } = await fetchHtmlWithMeta(url.toString(), IMPORTER_TIMEOUT_MS);
  if (!ok || !html) {
    // No HTML available (network error / timeout / blocked mid-fetch).
    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        status: "FAILED",
        rawHtml: null,
        errorMsg: `FETCH_FAILED_${status ?? "0"}`,
      },
    });

    // Build a prompt URL that pre-fills a humanized title and includes any OG we managed to see
    return redirect(buildPromptUrl(url, og, "FETCH_FAILED"));
  }

  // Paywall/access guard from JSON-LD
  if (detectPaywalledFromJsonLd(html)) {
    await prisma.importJob.update({
      where: { id: job.id },
      data: { status: "FAILED", errorMsg: "PAYWALLED" },
    });
    return redirect(buildPromptUrl(url, og, "PAYWALLED"));
  }

  // Attempt structured parse (JSON-LD → Microdata)
  const structured = tryParseStructured(html, url.toString());

  if (structured) {
    // back-fill missing image from Open Graph/Twitter
    const structuredEnriched: StructuredRecipe = {
      ...structured,
      image: structured.image ?? og?.image ?? undefined,
    };

    const recipe = await createStructuredRecipe({
      userId,
      sourceUrl: url.toString(),
      data: structuredEnriched,
    });

    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        status: "SUCCESS",
        parsedJson: structuredEnriched,
        errorMsg: null,
      },
    });

    return redirect(`/view/${recipe.slug ?? recipe.id}`);
  }
  // No structured data → show prompt
  return redirect(buildPromptUrl(url, og, "NO_SCHEMA"));
}


export async function createLinkOnlyRecipe(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("You must be signed in.");

  const payload = {
    url: (formData.get("url") || "").toString(),
    title: (formData.get("title") || "").toString(),
    image: (formData.get("image") || "").toString(),
    tags: (formData.get("tags") || "").toString(),
  };
  const parsed = LinkRecipeSchema.safeParse(payload);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input.");

  const url = new URL(parsed.data.url);
  const title = parsed.data.title.trim() || synthesizeTitleFromUrl(url);
  const imageExternalUrl = safeExternalImage(parsed.data.image);

  // simple tags parsing
  const tags = parsed.data.tags
    ? parsed.data.tags.split(",").map(s => s.trim()).filter(Boolean).slice(0, 6)
    : [];

  const slug = await uniqueRecipeSlug(title);

  const created = await prisma.recipe.create({
    data: {
      ownerId: session.user.id,
      type: "EXTERNAL",
      title,
      description: "",
      imageExternalUrl,
      ingredients: [],
      steps: [],
      tags,
      sourceUrl: url.toString(),
      isPublic: false,
      slug,
      status: "PUBLISHED",
    },
    select: { slug: true, id: true },
  });

  return redirect(`/view/${created.slug ?? created.id}`);
}

// -----------------------------
// Helpers — Persistence
// -----------------------------
async function createStructuredRecipe({
  userId,
  sourceUrl,
  data,
}: {
  userId: string;
  sourceUrl: string;
  data: StructuredRecipe;
}) {
  const title = data.title?.trim() || humanizeUrl(sourceUrl);
  const slug = await uniqueRecipeSlug(title);

  // Prefer explicit times; compute total if present
  //   const { prepMins, cookMins } = normalizeTimes(data);

  const created = await prisma.recipe.create({
    data: {
      ownerId: userId,
      type: "EXTERNAL",
      title,
      description: sanitizeDescription(data.description ?? ""),
      prepMins: data.prepMins ?? null,
      cookMins: data.cookMins ?? null,
      servings: data.servings ?? null,
      imageExternalUrl: safeExternalImage(data.image),
      ingredients: (data.ingredients ?? []).map(sanitizeInline).filter(Boolean),
      steps: (data.instructions ?? []).map(sanitizeInline).filter(Boolean),
      tags: normalizeTags({ raw: data.tags, title }),
      sourceUrl,
      isPublic: false,
      slug,
      status: "PUBLISHED",
    },
    select: { id: true, slug: true },
  });
  // Analytics hook could go here: RecipeImported (structured)
  return created;
}

function buildPromptUrl(u: URL, og?: OpenGraphMeta, reason?: string) {
  const title = (og?.title?.trim() || synthesizeTitleFromUrl(u)).slice(0, 120);
  const params = new URLSearchParams({
    url: u.toString(),
    title,
  });
  if (og?.image) params.set("image", og.image);
  if (reason) params.set("reason", reason);
  return `/import/link?${params.toString()}`;
}

function synthesizeTitleFromUrl(u: URL): string {
  const last = decodeURIComponent(u.pathname.split("/").filter(Boolean).pop() || u.hostname);
  const s = last.replace(/\.(html?|php|aspx?)$/i, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return s ? s.replace(/\b\w/g, c => c.toUpperCase()) : u.hostname.replace(/^www\./, "");
}

// -----------------------------
// Helpers — Fetch + Robots + Parsing
// -----------------------------
async function fetchHtmlWithMeta(
  url: string,
  timeoutMs: number
): Promise<{ ok: boolean; status?: number; html?: string; og?: OpenGraphMeta }> {
  const ac = new AbortController();
  const to = setTimeout(() => ac.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: {
        "User-Agent": IMPORTER_USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
      redirect: "follow",
      // Don’t include cookies; we’re fetching public pages
      credentials: "omit",
      cache: "no-store",
    });

    const status = res.status;
    if (!res.ok) {
      return { ok: false, status };
    }

    const html = await res.text();
    const og = extractOpenGraph(html);

    return { ok: true, status, html, og };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(to);
  }
}

async function checkRobotsAllowed(
  url: URL,
  timeoutMs: number
): Promise<{ allowed: boolean }> {
  // Conservative robots check: if /robots.txt disallows "/" for our UA or "*", treat as blocked.
  const robotsUrl = `${url.protocol}//${url.host}/robots.txt`;

  const ac = new AbortController();
  const to = setTimeout(() => ac.abort(), timeoutMs);

  try {
    const res = await fetch(robotsUrl, {
      signal: ac.signal,
      headers: { "User-Agent": IMPORTER_USER_AGENT, Accept: "text/plain" },
      redirect: "follow",
      credentials: "omit",
      cache: "no-store",
    });

    if (!res.ok) {
      // No robots.txt → allow by default
      return { allowed: true };
    }

    const text = (await res.text()) || "";
    const lines = text.split(/\r?\n/);

    // We only implement a minimal parser: if it declares "Disallow: /" for us or "*", we block.
    const blocks: Record<string, string[]> = {};
    let currentUA: string | null = null;

    for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;

      const [kRaw, vRaw] = line.split(":").map((s) => s.trim());
      const k = (kRaw || "").toLowerCase();

      if (k === "user-agent") {
        currentUA = (vRaw || "").toLowerCase();
        blocks[currentUA] ||= [];
      } else if (k === "disallow" && currentUA) {
        blocks[currentUA].push((vRaw || "").trim());
      }
    }

    const ua = IMPORTER_USER_AGENT.toLowerCase();
    const ourRules = blocks[ua] || blocks["*"] || [];
    // If any rule is exactly "/" (full block), treat as blocked.
    const fullBlock = ourRules.some((p) => p === "/");
    return { allowed: !fullBlock };
  } catch {
    // On failure to read robots, allow (common practice)
    return { allowed: true };
  } finally {
    clearTimeout(to);
  }
}

function tryParseStructured(html: string, pageUrl: string): StructuredRecipe | null {
  // 1) JSON-LD first
  const structuredFromJsonLd = parseJsonLd(html);
  if (structuredFromJsonLd) return structuredFromJsonLd;

  // 2) Microdata (minimal)
  const structuredFromMicrodata = parseMicrodata(html);
  if (structuredFromMicrodata) return structuredFromMicrodata;

  return null;
}

// -----------------------------
// JSON-LD parsing
// -----------------------------
function falseyFlag(v: any): boolean {
  if (v === false) return true;
  if (typeof v === "string") return /^(false|no|0)$/i.test(v.trim());
  return false;
}

/**
 * Looks for schema.org's isAccessibleForFree=false flag in any JSON-LD block.
 * Many publishers put it on WebPage/CreativeWork or in isPartOf; we consider any false → paywalled.
 */
function detectPaywalledFromJsonLd(html: string): boolean {
  const $ = loadHtml(html);
  const scripts = $('script[type="application/ld+json"]');
  if (!scripts.length) return false;

  const tryObjects: any[] = [];
  scripts.each((_, el) => {
    const raw = $(el).contents().text().trim();
    if (!raw) return;
    try {
      const obj = JSON.parse(raw);
      tryObjects.push(obj);
    } catch { /* ignore malformed JSON-LD blocks */ }
  });

  for (const payload of tryObjects) {
    const nodes = flattenJsonLd(payload);

    for (const n of nodes) {
      // Direct flag on any node
      if (falseyFlag(n?.isAccessibleForFree)) return true;

      // Nested under isPartOf (common)
      if (falseyFlag(n?.isPartOf?.isAccessibleForFree)) return true;

      // (Optional) If you want to be stricter only for Recipe/WebPage/Article types, uncomment:
      if ((hasType(n, "Recipe") || hasType(n, "WebPage") || hasType(n, "Article")) &&
          (falseyFlag(n?.isAccessibleForFree) || falseyFlag(n?.isPartOf?.isAccessibleForFree))) {
        return true;
      }
    }
  }
  return false;
}

// --- JSON-LD parsing (replace parseJsonLd + mapJsonLdRecipe and add helpers) ---
function parseJsonLd(html: string): StructuredRecipe | null {
  const $ = loadHtml(html);
  const scripts = $('script[type="application/ld+json"]');
  if (!scripts.length) return null;

  const tryObjects: any[] = [];
  scripts.each((_, el) => {
    const raw = $(el).contents().text().trim();
    if (!raw) return;
    try {
      const obj = JSON.parse(raw);
      tryObjects.push(obj);
    } catch { /* ignore */ }
  });

  for (const payload of tryObjects) {
    const nodes = flattenJsonLd(payload);
    const idIndex = buildIdIndex(nodes);

    const recipeNode = nodes.find((n) => hasType(n, "Recipe"));
    if (!recipeNode) continue;

    return mapJsonLdRecipe(recipeNode, idIndex);
  }
  return null;
}

function buildIdIndex(nodes: any[]): Map<string, any> {
  const m = new Map<string, any>();
  for (const n of nodes) {
    const id = n && typeof n === "object" ? n["@id"] : undefined;
    if (id && typeof id === "string") m.set(id, n);
  }
  return m;
}

function resolveImageRef(img: any, idIndex: Map<string, any>): string | undefined {
  // Accept string, ImageObject, array, or @id reference
  if (!img) return undefined;

  // Array → first resolvable
  if (Array.isArray(img)) {
    for (const item of img) {
      const r = resolveImageRef(item, idIndex);
      if (r) return r;
    }
    return undefined;
  }

  // String → assume URL
  if (typeof img === "string") return String(img);

  // Object → direct URL fields
  if (img?.url || img?.contentUrl || img?.thumbnailUrl) {
    return String(img.url ?? img.contentUrl ?? img.thumbnailUrl);
  }

  // Object with @id → look up referenced node
  if (img?.["@id"] && typeof img["@id"] === "string") {
    const target = idIndex.get(String(img["@id"]));
    if (!target) return undefined;
    return resolveImageRef(target, idIndex);
  }

  return undefined;
}

function mapJsonLdRecipe(node: any, idIndex: Map<string, any>): StructuredRecipe {
  const imageUrl = resolveImageRef(node?.image, idIndex);

  const ingredients = Array.isArray(node?.recipeIngredient)
    ? node.recipeIngredient.map(String)
    : undefined;

  const instructions = parseJsonLdInstructions(node?.recipeInstructions);

  return {
    title: node?.name ? String(node.name).trim() : "",
    description: node?.description ? String(node.description) : undefined,
    image: imageUrl,
    ingredients,
    instructions,
    servings: maybeNumber(node?.recipeYield),
    prepMins: parseIsoDurationMinutes(node?.prepTime) ?? null,
    cookMins: parseIsoDurationMinutes(node?.cookTime) ?? null,
    tags: parseKeywords(node?.keywords),
    author:
      typeof node?.author === "string"
        ? node.author
        : node?.author?.name
          ? String(node.author.name)
          : undefined,
  };
}


function flattenJsonLd(obj: any): any[] {
  const out: any[] = [];
  (function walk(n: any) {
    if (n && typeof n === "object") {
      out.push(n);
      if (Array.isArray(n)) n.forEach(walk);
      else {
        for (const k of Object.keys(n)) walk(n[k]);
      }
    }
  })(obj);
  return out;
}

function hasType(node: any, type: string): boolean {
  const t = node?.["@type"];
  if (typeof t === "string") return t.toLowerCase() === type.toLowerCase();
  if (Array.isArray(t)) return t.map((x) => String(x).toLowerCase()).includes(type.toLowerCase());
  return false;
}

function parseJsonLdInstructions(instr: any): string[] | undefined {
  if (!instr) return undefined;
  if (Array.isArray(instr)) {
    // Could be strings, HowToStep objects, or HowToSection with "itemListElement"
    const out: string[] = [];
    for (const item of instr) {
      if (typeof item === "string") out.push(item);
      else if (item?.text) out.push(String(item.text));
      else if (item?.name && item?.itemListElement) {
        // Section title + steps
        const steps = parseJsonLdInstructions(item.itemListElement);
        if (steps?.length) out.push(...steps);
      }
    }
    return out.length ? out : undefined;
  }
  if (typeof instr === "string") return [instr];
  if (instr?.text) return [String(instr.text)];
  if (instr?.itemListElement) return parseJsonLdInstructions(instr.itemListElement);
  return undefined;
}

function parseKeywords(keywords: any): string[] | undefined {
  if (!keywords) return undefined;
  if (Array.isArray(keywords)) return keywords.map(String);
  if (typeof keywords === "string") {
    if (keywords.includes(",")) return keywords.split(",").map((s) => s.trim()).filter(Boolean);
    return [keywords.trim()];
  }
  return undefined;
}

function maybeNumber(x: any): number | undefined {
  if (typeof x === "number") return x;
  if (typeof x === "string") {
    const m = x.match(/\d+/);
    if (m) return Number(m[0]);
  }
  return undefined;
}

function parseIsoDurationMinutes(dur: any): number | null {
  if (!dur || typeof dur !== "string") return null;
  // Simple ISO8601 duration parser for PT#H#M
  const m = dur.match(/P(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/i);
  if (!m) return null;
  const hours = m[2] ? parseInt(m[2], 10) : 0;
  const mins = m[3] ? parseInt(m[3], 10) : 0;
  const secs = m[4] ? parseInt(m[4], 10) : 0;
  return hours * 60 + mins + Math.round(secs / 60);
}

// -----------------------------
// Microdata (minimal best-effort)
// -----------------------------
function parseMicrodata(html: string): StructuredRecipe | null {
  const $ = loadHtml(html);
  // Find an element declaring schema.org/Recipe
  const root =
    $('[itemscope][itemtype*="schema.org/Recipe"], [itemscope][itemtype*="Schema.org/Recipe"]').first();
  if (!root.length) return null;

  const getText = (sel: string) => {
    const el = root.find(sel).first();
    const content = el.attr("content");
    return (content ?? el.text() ?? "").trim();
  };

  const title = getText('[itemprop="name"]') || $("title").first().text().trim();
  const description = getText('[itemprop="description"]') || undefined;

  const image =
    root.find('[itemprop="image"]').attr("content") ||
    root.find('[itemprop="image"]').attr("src") ||
    undefined;

  const ingredients: string[] = [];
  root.find('[itemprop="recipeIngredient"]').each((_, el) => {
    const t = ($(el).attr("content") || $(el).text() || "").trim();
    if (t) ingredients.push(t);
  });

  const instructions: string[] = [];
  root.find('[itemprop="recipeInstructions"]').each((_, el) => {
    const $el = $(el);
    const text =
      $el.attr("content") ||
      $el.find('[itemprop="text"]').text() ||
      $el.text() ||
      "";
    const cleaned = text.replace(/\s+/g, " ").trim();
    if (cleaned) instructions.push(cleaned);
  });

  const servings = maybeNumber(getText('[itemprop="recipeYield"]'));
  const prepMins = parseIsoDurationMinutes(getText('[itemprop="prepTime"]'));
  const cookMins = parseIsoDurationMinutes(getText('[itemprop="cookTime"]'));

  if (!title || (!ingredients.length && !instructions.length)) {
    // Not confident enough
    return null;
  }

  return {
    title,
    description,
    image,
    ingredients: ingredients.length ? ingredients : undefined,
    instructions: instructions.length ? instructions : undefined,
    servings,
    prepMins,
    cookMins,
  };
}

// -----------------------------
// Open Graph extraction
// -----------------------------
type OpenGraphMeta = {
  title?: string;
  image?: string;
  siteName?: string;
};

function extractOpenGraph(html: string): OpenGraphMeta {
  const $ = loadHtml(html);
  const get = (prop: string) =>
    $(`meta[property="${prop}"]`).attr("content") ||
    $(`meta[name="${prop}"]`).attr("content") ||
    undefined;

  const title = get("og:title") || $("title").first().text().trim() || undefined;
  const image = get("og:image");
  const siteName = get("og:site_name");
  return { title, image, siteName };
}

// -----------------------------
// Small utilities
// -----------------------------
function humanizeUrl(u: string): string {
  try {
    const url = new URL(u);
    const path = url.pathname.replace(/\/+$/, "");
    return path && path !== "/"
      ? `${url.hostname}${path.split("/").slice(0, 3).join("/")}`
      : url.hostname;
  } catch {
    return u;
  }
}

function safeExternalImage(src?: string): string | null {
  if (!src) return null;
  try {
    const u = new URL(src);
    if (!/^https?:$/i.test(u.protocol)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

// function normalizeTimes(data: StructuredRecipe): { prepMins: number | null; cookMins: number | null } {
//   // If only totalMins is present and neither prep nor cook are given, we can store total as cookMins (best effort).
//   if (data.prepMins == null && data.cookMins == null && data.totalMins != null) {
//     return { prepMins: null, cookMins: data.totalMins };
//   }
//   return { prepMins: data.prepMins ?? null, cookMins: data.cookMins ?? null };
// }

// --- Text cleansing ---------------------------------------------------------

/** Cleans long-form fields like description. */
function sanitizeDescription(input: string): string {
  if (!input) return "";
  let s = he.decode(input);                // &amp; &#39; etc → real characters
  s = stripHtml(s);                        // remove residual tags if any
  s = removeBoilerplateSentences(s);       // e.g., "Recipe video above."
  s = fixMissingSpaceAfterPeriods(s);      // ".Doesn" → ". Doesn"
  s = s.replace(/\s+/g, " ").trim();       // collapse whitespace
  return s;
}

/** Cleans short inline fields (ingredients, step lines). */
function sanitizeInline(input: string): string {
  if (!input) return "";
  let s = he.decode(input);
  s = stripHtml(s);
  // keep it light for inline text: just collapse spaces
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

function stripHtml(input: string): string {
  // very light HTML stripper for safety; JSON-LD is usually plaintext already
  return input.replace(/<[^>]*>/g, "");
}

const BOILERPLATE_PATTERNS: RegExp[] = [
  /\brecipe\s+video\s+(?:above|below)\b[:.]?/i,
  /\bvideo\s+(?:above|below)\b[:.]?/i,
  /\bsee\s+(?:notes?|tips?)(?:\s+below)?\b[:.]?/i,
];
function removeBoilerplateSentences(input: string): string {
  // Remove small “utility” sentences that often leak into JSON-LD descriptions
  let s = input;
  for (const rx of BOILERPLATE_PATTERNS) {
    s = s.replace(new RegExp(`(^|\\s)${rx.source}(?=\\s|$)`, "gi"), " ");
  }
  return s;
}

/** Insert a space after a period if the next char is a capital letter and no space present. */
function fixMissingSpaceAfterPeriods(input: string): string {
  return input.replace(/\.([A-Z])/g, ". $1");
}

// --- Tag normalization ------------------------------------------------------

/**
 * Turn raw keywords (often long phrases) + title signal into friendly, general tags:
 * e.g., "chicken in white wine sauce" → ["Chicken", maybe "Dinner"], "quick" → "Easy".
 * Caps at 5 tags, deduped.
 */
function normalizeTags({ raw, title }: { raw?: string[]; title?: string }): string[] {
  const text = `${(title ?? "").toLowerCase()} ${(raw ?? []).join(" ").toLowerCase()}`;

  // Scan in priority order so results feel human: Course → Protein → Diet → Method/Difficulty → Cuisine → Adjectives
  const out: string[] = [];
  scanAndPush(out, text, COURSE_KEYS);
  scanAndPush(out, text, PROTEIN_KEYS);
  scanAndPush(out, text, DIET_KEYS);
  scanAndPush(out, text, METHOD_KEYS);
  scanAndPush(out, text, CUISINE_KEYS);
  scanAndPush(out, text, ADJECTIVE_KEYS);

  // “Quick/weeknight/30-minute” style → Easy
  if (/\b(quick|weeknight|easy|simple|fast|under\s*\d+\s*min)/i.test(text)) push(out, "Easy");

  // Keep it tidy
  return Array.from(new Set(out)).slice(0, 5);
}

function scanAndPush(out: string[], text: string, keys: string[]) {
  for (const k of keys) {
    const re = new RegExp(`\\b${escapeReg(k)}\\b`, "i");
    if (re.test(text)) push(out, CANONICAL[k]);
  }
}
function push(arr: string[], v?: string) {
  if (v && !arr.includes(v)) arr.push(v);
}
function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Canonical tags (what we *show*) mapped from lots of possible input words/phrases. */
const CANONICAL: Record<string, string> = {
  // Course
  breakfast: "Breakfast", brunch: "Brunch", lunch: "Lunch", dinner: "Dinner",
  dessert: "Dessert", soup: "Soup", salad: "Salad", side: "Side",
  appetizer: "Appetizer", starter: "Appetizer", snack: "Snack",

  // Protein (keep high-level; fold shellfish into Seafood)
  chicken: "Chicken", beef: "Beef", pork: "Pork", lamb: "Lamb",
  turkey: "Turkey", duck: "Duck", fish: "Fish", seafood: "Seafood",
  salmon: "Seafood", tuna: "Seafood", shrimp: "Seafood", prawn: "Seafood", prawns: "Seafood",
  tofu: "Tofu", tempeh: "Tempeh", egg: "Egg",

  // Diets
  vegan: "Vegan", vegetarian: "Vegetarian",
  "gluten free": "Gluten-Free", "gluten-free": "Gluten-Free",
  "dairy free": "Dairy-Free", "dairy-free": "Dairy-Free",
  keto: "Keto", paleo: "Paleo", "low carb": "Low-Carb", "low-carb": "Low-Carb",

  // Methods / Difficulty / Format
  easy: "Easy", quick: "Easy", weeknight: "Easy",
  "one pot": "One-Pot", "one-pot": "One-Pot", "one pan": "One-Pan",
  "sheet pan": "Sheet-Pan", "sheet-pan": "Sheet-Pan",
  "slow cooker": "Slow Cooker", "instant pot": "Instant Pot", "air fryer": "Air Fryer",
  grill: "Grill", bbq: "BBQ", baked: "Baked", roasted: "Roasted",
  "stir fry": "Stir-Fry", "stir-fry": "Stir-Fry",

  // Cuisines (broad)
  italian: "Italian", mexican: "Mexican", indian: "Indian", chinese: "Chinese",
  thai: "Thai", japanese: "Japanese", korean: "Korean", greek: "Greek",
  french: "French", spanish: "Spanish", lebanese: "Lebanese",
  "middle eastern": "Middle Eastern", vietnamese: "Vietnamese",

  // Adjectives (only a few useful ones)
  spicy: "Spicy", healthy: "Healthy", creamy: "Creamy",
};

const COURSE_KEYS = ["breakfast", "brunch", "lunch", "dinner", "dessert", "soup", "salad", "side", "appetizer", "starter", "snack"];
const PROTEIN_KEYS = ["chicken", "beef", "pork", "lamb", "turkey", "duck", "fish", "seafood", "salmon", "tuna", "shrimp", "prawn", "prawns", "tofu", "tempeh", "egg"];
const DIET_KEYS = ["vegan", "vegetarian", "gluten free", "gluten-free", "dairy free", "dairy-free", "keto", "paleo", "low carb", "low-carb"];
const METHOD_KEYS = ["easy", "quick", "weeknight", "one pot", "one-pot", "one pan", "sheet pan", "sheet-pan", "slow cooker", "instant pot", "air fryer", "grill", "bbq", "baked", "roasted", "stir fry", "stir-fry"];
const CUISINE_KEYS = ["italian", "mexican", "indian", "chinese", "thai", "japanese", "korean", "greek", "french", "spanish", "lebanese", "middle eastern", "vietnamese"];
const ADJECTIVE_KEYS = ["spicy", "healthy", "creamy"];

