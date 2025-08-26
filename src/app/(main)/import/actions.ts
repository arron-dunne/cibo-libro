// app/(main)/import/actions.ts
"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { load as loadHtml } from "cheerio";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client"
import { uniqueRecipeSlug } from "@/lib/uniqueSlug";

// -----------------------------
// Config (ENV + sensible defaults)
// -----------------------------
const IMPORTER_USER_AGENT =
  process.env.IMPORTER_USER_AGENT ??
  "CiboLibroBot/0.1 (+https://cibolibro.com; contact support@cibolibro.com)";

const IMPORTER_TIMEOUT_MS = Number(process.env.IMPORTER_TIMEOUT_MS ?? 7000);

// CSV list like: "example.com,recipetineats.com,someblog.net"
const DENYLIST = (process.env.IMPORTER_DENYLIST ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

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
        sourceUrl: url.toString() },
    select: { id: true },
  });

  // Compliance: denylist short-circuit
  const isDenylisted = DENYLIST.includes(hostname);
  if (isDenylisted) {
    const recipe = await createLinkOnlyRecipe({
      userId,
      sourceUrl: url.toString(),
      // We will NOT fetch HTML on denylist; we’ll synthesize a decent title from URL.
      og: undefined,
      robotsBlocked: false,
    });
    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        status: "SUCCESS",
        parsedJson: Prisma.DbNull,
        rawHtml: null,
        errorMsg: null,
      },
    });
    return redirect(`/view/${recipe.slug ?? recipe.id}`);
  }

  // Compliance: respect robots.txt (conservative)
  const robots = await checkRobotsAllowed(url, IMPORTER_TIMEOUT_MS);
  if (!robots.allowed) {
    // No fetch of HTML; create link-only card with minimal info
    const recipe = await createLinkOnlyRecipe({
      userId,
      sourceUrl: url.toString(),
      og: undefined,
      robotsBlocked: true,
    });
    await prisma.importJob.update({
      where: { id: job.id },
      data: { status: "SUCCESS", parsedJson: Prisma.DbNull, rawHtml: null, errorMsg: "ROBOTS_BLOCKED" },
    });
    return redirect(`/view/${recipe.slug ?? recipe.id}`);
  }

  // Try fetching the page (polite UA, timeout)
  const { ok, status, html, og } = await fetchHtmlWithMeta(url.toString(), IMPORTER_TIMEOUT_MS);
  if (!ok || !html) {
    // On network error/timeouts, still save a link card with OG if we have it
    const recipe = await createLinkOnlyRecipe({
      userId,
      sourceUrl: url.toString(),
      og,
      robotsBlocked: false,
    });
    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        status: "FAILED",
        rawHtml: null,
        errorMsg: `FETCH_FAILED_${status ?? "0"}`,
      },
    });
    return redirect(`/view/${recipe.slug ?? recipe.id}`);
  }

  // Attempt structured parse (JSON-LD → Microdata)
  const structured = tryParseStructured(html, url.toString());

  if (structured) {
    // Map to DB fields (EXTERNAL, private)
    const recipe = await createStructuredRecipe({
      userId,
      sourceUrl: url.toString(),
      data: structured,
    });

    // Store truncated HTML + parsedJson for diagnostics (optional)
    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        status: "SUCCESS",
        rawHtml: html.slice(0, RAW_HTML_MAX),
        parsedJson: structured,
        errorMsg: null,
      },
    });

    return redirect(`/view/${recipe.slug ?? recipe.id}`);
  }

  // Fallback: link-only card using OG tags if available
  const recipe = await createLinkOnlyRecipe({
    userId,
    sourceUrl: url.toString(),
    og,
    robotsBlocked: false,
  });

  await prisma.importJob.update({
    where: { id: job.id },
    data: {
      status: "SUCCESS",
      rawHtml: html.slice(0, RAW_HTML_MAX),
      parsedJson: Prisma.DbNull,
      errorMsg: "NO_STRUCTURED_DATA",
    },
  });

  return redirect(`/view/${recipe.slug ?? recipe.id}`);
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
      description: data.description ?? "",
      prepMins: data.prepMins ?? null,
      cookMins: data.cookMins ?? null,
      servings: data.servings ?? null,
      imageExternalUrl: safeExternalImage(data.image),
      ingredients: data.ingredients ?? [],
      steps: data.instructions ?? [],
      tags: data.tags ?? [],
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

async function createLinkOnlyRecipe({
  userId,
  sourceUrl,
  og,
  robotsBlocked,
}: {
  userId: string;
  sourceUrl: string;
  og?: Partial<OpenGraphMeta>;
  robotsBlocked: boolean;
}) {
  const title =
    (og?.title && og.title.trim()) ||
    humanizeUrl(sourceUrl) +
      (robotsBlocked ? " (link only — site blocked importing)" : "");
  const slug = await uniqueRecipeSlug(title);

  const created = await prisma.recipe.create({
    data: {
      ownerId: userId,
      type: "EXTERNAL",
      title,
      description: "",
      prepMins: null,
      cookMins: null,
      servings: null,
      imageExternalUrl: safeExternalImage(og?.image),
      ingredients: [],
      steps: [],
      tags: [],
      sourceUrl,
      isPublic: false,
      slug,
      status: "PUBLISHED",
    },
    select: { id: true, slug: true },
  });
  // Analytics hook could go here: RecipeImported (link)
  return created;
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
    } catch {
      /* ignore invalid JSON */
    }
  });

  // Flatten potential arrays/graphs and find first Recipe
  for (const payload of tryObjects) {
    const nodes = flattenJsonLd(payload);
    const recipeNode = nodes.find((n) => hasType(n, "Recipe"));
    if (!recipeNode) continue;

    return mapJsonLdRecipe(recipeNode);
  }
  return null;
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

function mapJsonLdRecipe(node: any): StructuredRecipe {
  const get = (k: string) => (node?.[k] ?? "").toString().trim();
  const image = Array.isArray(node?.image)
    ? node.image[0]
    : typeof node?.image === "string"
    ? node.image
    : node?.image?.url;

  const ingredients = Array.isArray(node?.recipeIngredient)
    ? node.recipeIngredient.map(String)
    : undefined;

  const instructions = parseJsonLdInstructions(node?.recipeInstructions);

  return {
    title: get("name"),
    description: node?.description ? String(node.description) : undefined,
    image: image ? String(image) : undefined,
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
