"use server";


import ky from "ky";
import { redirect } from "next/navigation";
import { z } from "zod";
import he from "he";
import { load } from "cheerio";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { uniqueRecipeSlug } from "@/lib/uniqueSlug";
import { isDenylisted } from "@/lib/denylist";
import { isSafeUrl } from "@/lib/validation/safeUrl";


class UnsafeUrlError extends Error {
  name = "UnsafeUrlError";
}

// TODO: setup support email channel
/** Outbound HTTP settings */
const IMPORTER_USER_AGENT =
  process.env.IMPORTER_USER_AGENT ??
  "CiboLibroBot/0.1 (+https://cibolibro.com; contact support@cibolibro.com)";
const IMPORTER_TIMEOUT_MS = Number(process.env.IMPORTER_TIMEOUT_MS ?? 7000);

type ImportFailReason = "ROBOTS" | "DENYLIST" | "PAYWALL" | "ERROR" | "NO_SCHEMA";

// Form payload validation (with honeypot)
const ImportSchema = z.object({
  url: z.url().max(2000),
  // Honeypot (bot trap). Must be absent/empty.
  website: z.string().optional().refine((v) => !v),
});

type StructuredRecipe = {
  title: string;
  description?: string;
  image?: string;
  ingredients?: string[];
  instructions?: string[];
  servings?: number;
  prepMins?: number | null;
  cookMins?: number | null;
  tags?: string[];
  author?: string;
};

type OpenGraphMeta = {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
};

// Safe fetcher which checks URL is safe before fetching and contains options
const safeFetcher = ky.extend({
  method: "get",
  timeout: IMPORTER_TIMEOUT_MS,
  headers: {
    "User-Agent": IMPORTER_USER_AGENT,
    Accept: "text/html,text/plain,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  },
  redirect: "follow",
  credentials: "omit",
  cache: "no-store",
  hooks: {
    // Check URL is safe before every request
    beforeRequest: [async (req) => {
      const safe = await isSafeUrl(req.url);
      if (!safe) {
        throw new UnsafeUrlError();
      }
    }]
  },
  retry: {
    limit: 3,
    // Dont retry if the error is from unsafe URL
    shouldRetry: ({ error }) => {
      if (error instanceof UnsafeUrlError) {
        return false;
      }
      return true;
    }
  }
});

// Server action
export async function importRecipe(formData: FormData) {

  // Authentication
  const session = await auth();
  if (!session?.user?.id) throw new Error("You must be signed in to import recipes.");
  const userId = session.user.id;

  // Parse form data
  const parsed = ImportSchema.safeParse({
    url: String(formData.get("url") ?? "").trim(),
    website: String(formData.get("website") ?? "").trim(),
  });
  if (!parsed.success) throw new Error("Invalid input");

  const url = new URL(parsed.data.url);

  // Create ImportJob
  const job = await prisma.importJob.create({
    data: { userId, sourceUrl: url.toString() },
    select: { id: true },
  });

  // Denylisted
  if (isDenylisted(url.hostname.toLowerCase())) {
    await failJob(job.id, "DENYLIST");
    return redirect(buildPromptUrl(url, undefined));
  }

  // Robots.txt
  const allowed = await isRobotsAllowed(url);
  if (!allowed) {
    await failJob(job.id, "ROBOTS");
    return redirect(buildPromptUrl(url, undefined));
  }

  // Fetch page
  const { ok, status, html, og } = await fetchHtmlWithMeta(url);
  if (!ok || !html) {
    await failJob(job.id, "ERROR", `FETCH_FAILED_${status ?? "0"}`);
    return redirect(buildPromptUrl(url, og));
  }

  // Paywall detection via JSON-LD
  if (detectPaywall(html)) {
    await failJob(job.id, "PAYWALL");
    return redirect(buildPromptUrl(url, og));
  }

  // Parse structured (JSON-LD → microdata)
  // const structured = tryParseStructured(html);
  // if (structured) {
  //   const enriched: StructuredRecipe = { ...structured, image: structured.image ?? og?.image ?? undefined };
  //   const recipe = await createStructuredRecipe({ userId, sourceUrl: url.toString(), data: enriched });

  //   await prisma.importJob.update({
  //     where: { id: job.id },
  //     data: { status: "SUCCESS", parsedJson: enriched, errorMsg: null },
  //   });

  //   return redirect(`/view/${recipe.slug ?? recipe.id}`);
  // }

  // // No structured data → Link Card prompt
  // await failJob(job.id, "NO_SCHEMA");
  // return redirect(buildPromptUrl(url, og));
}

// Fetch HTML and basic OG from URL
async function fetchHtmlWithMeta(
  url: URL,
): Promise<{ ok: boolean; status?: number; html?: string; og?: OpenGraphMeta }> {
  try {
    // Fetch URL with the safe fetcher (URL checking)
    const res = await safeFetcher.get(url);
    const status = res.status;

    if (!res.ok) return { ok: false, status };

    // Parse HTML and then extract any OpenGraph data
    const html = await res.text();
    const og = extractOpenGraph(html);

    return { ok: true, status, html, og };
  } catch {
    return { ok: false };
  }
}

/** Persist structured recipe into your model (safe-cleansed text). */
async function createStructuredRecipe({
  userId,
  sourceUrl,
  data,
}: {
  userId: string;
  sourceUrl: string;
  data: StructuredRecipe;
}) {
  const title = (data.title || humanizeUrl(sourceUrl)).trim();
  const slug = await uniqueRecipeSlug(title);

  const created = await prisma.recipe.create({
    data: {
      ownerId: userId,
      type: "EXTERNAL_FULL",
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

  return created;
}

/** Update job to FAILED with optional message. */
async function failJob(jobId: string, reason: ImportFailReason, message?: string) {
  await prisma.importJob.update({
    where: { id: jobId },
    data: { status: "FAILED", errorMsg: message ?? reason },
  });
}

// Build the /import/link URL with safe defaults + OG hints
function buildPromptUrl(u: URL, og?: OpenGraphMeta) {
  const title = (og?.title?.trim() || synthesizeTitleFromUrl(u)).slice(0, 120);
  const params = new URLSearchParams({ url: u.toString(), title });
  if (og?.image) params.set("image", og.image);
  if (og?.siteName) params.set("siteName", og.siteName);
  return `/import/link?${params.toString()}`;
}

/** Fallback title synthesised from URL. */
function synthesizeTitleFromUrl(u: URL): string {
  const last = decodeURIComponent(u.pathname.split("/").filter(Boolean).pop() || u.hostname);
  const s = last.replace(/\.(html?|php|aspx?)$/i, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return s ? s.replace(/\b\w/g, (c) => c.toUpperCase()) : u.hostname.replace(/^www\./, "");
}

// TODO: improve, currently user agents on consecutive lines arnt handled correctly
// Check robots.txt to see if importing is allowed, returning yes (true) or no (false)
async function isRobotsAllowed(url: URL): Promise<boolean> {
  const robotsUrl = `${url.protocol}//${url.host}/robots.txt`;

  try {
    const res = await safeFetcher(robotsUrl)

    // allow if robots.txt doesnt exist
    if (!res.ok) return true;

    const text = (await res.text()) || "";
    const blocks: Record<string, string[]> = {};
    let currentUA: string | null = null;

    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const [kRaw, vRaw] = line.split(":");
      const k = (kRaw ?? "").trim().toLowerCase();
      const v = (vRaw ?? "").trim();
      if (k === "user-agent") {
        currentUA = v.toLowerCase();
        if (!blocks[currentUA]) blocks[currentUA] = [];
      } else if (k === "disallow" && currentUA) {
        blocks[currentUA].push(v);
      }
    }

    const ua = IMPORTER_USER_AGENT.toLowerCase();
    const ourRules = blocks[ua] || blocks["*"] || [];
    const fullBlock = ourRules.some((p) => p === "/");
    return !fullBlock;

  } catch {
    // allow if error (common practice)
    return true;
  }
}

/** Parse structured recipe from JSON-LD or microdata. */
function tryParseStructured(html: string): StructuredRecipe | null {
  const fromLd = parseJsonLd(html);
  if (fromLd) return fromLd;
  const fromMicro = parseMicrodata(html);
  if (fromMicro) return fromMicro;
  return null;
}

/* ---------------- JSON-LD helpers (type-safe, no `any`) ---------------- */

type JSONPrimitive = string | number | boolean | null;
type JSONValue = JSONPrimitive | JSONObject | JSONValue[];
type JSONObject = { [k: string]: JSONValue };

function isObject(v: unknown): v is JSONObject {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function isArray(v: unknown): v is JSONValue[] {
  return Array.isArray(v);
}

// Look for a paywall in the JSON-LD, return true if we find one
function detectPaywall(html: string): boolean {
  const $ = load(html);

  // Get all script tags with json-ld
  const allJsonld = $('script[type="application/ld+json"]');
  if (!allJsonld.length) return false;

  const data: Object[] = [];

  // Parse the json ld tags into a json object, skipping any malformed data
  allJsonld.each((_, el) => {
    const raw = $(el).text().trim();
    if (!raw) return;

    try {
      data.push(JSON.parse(raw));
    } catch {
      // ignore malformed JSON-LD
    }
  });

  return hasPaywallFlag(data);
}

// Recursive function to search nested JSON object for paywall flags
function hasPaywallFlag(data: unknown): boolean {

  if (!data) { return false; }

  // Recursive call for each element in an array
  if (Array.isArray(data)) {
    return data.some(hasPaywallFlag);
  }

  if (typeof data === "object") {
    for (const [key, val] of Object.entries(data)) {
      if (key === "isAccessibleForFree" &&
        (val === false || val === "false" || val === 0 || val === "0")
      ) {
        return true;
      }

      // Recursive search on child objects
      if (val && typeof val === "object") {
        if (hasPaywallFlag(val)) return true;
      }
    }
  }

  return false;

}

function parseJsonLd(html: string): StructuredRecipe | null {
  const $ = load(html);
  const scripts = $('script[type="application/ld+json"]');
  if (!scripts.length) return null;

  const payloads: JSONValue[] = [];
  scripts.each((_, el) => {
    const raw = $(el).contents().text().trim();
    if (!raw) return;
    try {
      payloads.push(JSON.parse(raw) as JSONValue);
    } catch {
      /* ignore */
    }
  });

  const nodes = payloads.flatMap(flattenJsonLd);
  const idIndex = buildIdIndex(nodes);

  const recipeNode = nodes.find((n) => hasType(n, "Recipe"));
  return recipeNode ? mapJsonLdRecipe(recipeNode, idIndex) : null;
}

function flattenJsonLd(obj: JSONValue): JSONObject[] {
  const out: JSONObject[] = [];
  (function walk(n: JSONValue) {
    if (isObject(n)) out.push(n);
    if (isArray(n)) n.forEach((x) => walk(x));
    else if (isObject(n)) Object.keys(n).forEach((k) => {
      const v = n[k];
      if (v !== undefined) walk(v as JSONValue);
    });
  })(obj);
  return out;
}

function buildIdIndex(nodes: JSONObject[]): Map<string, JSONObject> {
  const m = new Map<string, JSONObject>();
  for (const n of nodes) {
    const id = typeof n["@id"] === "string" ? (n["@id"] as string) : undefined;
    if (id) m.set(id, n);
  }
  return m;
}

function hasType(node: JSONObject, type: string): boolean {
  const t = node["@type"];
  if (typeof t === "string") return t.toLowerCase() === type.toLowerCase();
  if (isArray(t)) return t.map(String).map((s) => s.toLowerCase()).includes(type.toLowerCase());
  return false;
}

function resolveImageRef(img: JSONValue | undefined, idIndex: Map<string, JSONObject>): string | undefined {
  if (img == null) return undefined;
  if (typeof img === "string") return img;
  if (isArray(img)) {
    for (const item of img) {
      const r = resolveImageRef(item, idIndex);
      if (r) return r;
    }
    return undefined;
  }
  if (isObject(img)) {
    const direct =
      (typeof img["url"] === "string" && (img["url"] as string)) ||
      (typeof img["contentUrl"] === "string" && (img["contentUrl"] as string)) ||
      (typeof img["thumbnailUrl"] === "string" && (img["thumbnailUrl"] as string));
    if (direct) return direct;

    const ref = typeof img["@id"] === "string" ? (img["@id"] as string) : undefined;
    if (ref) {
      const target = idIndex.get(ref);
      if (target) return resolveImageRef(target, idIndex);
    }
  }
  return undefined;
}

function mapJsonLdRecipe(node: JSONObject, idIndex: Map<string, JSONObject>): StructuredRecipe {
  const imageUrl = resolveImageRef(node["image"], idIndex);

  const ingredients: string[] | undefined = isArray(node["recipeIngredient"])
    ? (node["recipeIngredient"] as JSONValue[]).map(String)
    : undefined;

  const instructions = parseJsonLdInstructions(node["recipeInstructions"]);

  const author =
    typeof node["author"] === "string"
      ? (node["author"] as string)
      : isObject(node["author"]) && typeof node["author"]["name"] === "string"
        ? (node["author"]["name"] as string)
        : undefined;

  return {
    title: typeof node["name"] === "string" ? node["name"].trim() : "",
    description: typeof node["description"] === "string" ? (node["description"] as string) : undefined,
    image: imageUrl,
    ingredients,
    instructions,
    servings: maybeNumber(node["recipeYield"]),
    prepMins: parseIsoDurationMinutes(typeof node["prepTime"] === "string" ? (node["prepTime"] as string) : null),
    cookMins: parseIsoDurationMinutes(typeof node["cookTime"] === "string" ? (node["cookTime"] as string) : null),
    tags: parseKeywords(node["keywords"]),
    author,
  };
}

function parseJsonLdInstructions(instr: JSONValue | undefined): string[] | undefined {
  if (instr == null) return undefined;

  if (typeof instr === "string") return [instr];

  if (isArray(instr)) {
    const out: string[] = [];
    for (const item of instr) {
      if (typeof item === "string") out.push(item);
      else if (isObject(item)) {
        if (typeof item["text"] === "string") out.push(item["text"] as string);
        // HowToSection
        if (isArray(item["itemListElement"])) {
          const nested = parseJsonLdInstructions(item["itemListElement"]);
          if (nested?.length) out.push(...nested);
        }
      }
    }
    return out.length ? out : undefined;
  }

  if (isObject(instr)) {
    if (typeof instr["text"] === "string") return [instr["text"] as string];
    if (isArray(instr["itemListElement"])) return parseJsonLdInstructions(instr["itemListElement"]);
  }

  return undefined;
}

function parseKeywords(keywords: JSONValue | undefined): string[] | undefined {
  if (!keywords) return undefined;
  if (isArray(keywords)) return keywords.map(String);
  if (typeof keywords === "string") {
    const s = keywords.trim();
    if (!s) return undefined;
    return s.includes(",") ? s.split(",").map((x) => x.trim()).filter(Boolean) : [s];
  }
  return undefined;
}

function maybeNumber(x: JSONValue | undefined): number | undefined {
  if (typeof x === "number") return x;
  if (typeof x === "string") {
    const m = x.match(/\d+/);
    if (m) return Number(m[0]);
  }
  return undefined;
}

function parseIsoDurationMinutes(dur: string | null): number | null {
  if (!dur) return null;
  const m = dur.match(/P(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/i);
  if (!m) return null;
  const hours = m[2] ? parseInt(m[2], 10) : 0;
  const mins = m[3] ? parseInt(m[3], 10) : 0;
  const secs = m[4] ? parseInt(m[4], 10) : 0;
  return hours * 60 + mins + Math.round(secs / 60);
}

/* ---------------- Microdata (best-effort) ---------------- */

function parseMicrodata(html: string): StructuredRecipe | null {
  const $ = load(html);
  const root = $('[itemscope][itemtype*="schema.org/Recipe"], [itemscope][itemtype*="Schema.org/Recipe"]').first();
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
    const text = $el.attr("content") || $el.find('[itemprop="text"]').text() || $el.text() || "";
    const cleaned = text.replace(/\s+/g, " ").trim();
    if (cleaned) instructions.push(cleaned);
  });

  const servings = maybeNumber(getText('[itemprop="recipeYield"]'));
  const prepMins = parseIsoDurationMinutes(getText('[itemprop="prepTime"]') || null);
  const cookMins = parseIsoDurationMinutes(getText('[itemprop="cookTime"]') || null);

  if (!title || (!ingredients.length && !instructions.length)) return null;

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

/* ---------------- Open Graph + small utils ---------------- */

function extractOpenGraph(html: string): OpenGraphMeta {
  const $ = load(html);
  const get = (prop: string) =>
    $(`meta[property="${prop}"]`).attr("content") || $(`meta[name="${prop}"]`).attr("content") || undefined;

  const title = get("og:title") || $("title").first().text().trim() || undefined;
  const description = get("og:description") || undefined;
  const image = get("og:image");
  const siteName = get("og:site_name");
  return { title, description, image, siteName };
}

function humanizeUrl(u: string): string {
  try {
    const url = new URL(u);
    const path = url.pathname.replace(/\/+$/, "");
    return path && path !== "/" ? `${url.hostname}${path.split("/").slice(0, 3).join("/")}` : url.hostname;
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

/* ---------------- Text cleansing + tag normalisation ---------------- */

function sanitizeDescription(input: string): string {
  if (!input) return "";
  let s = he.decode(input);
  s = stripHtml(s);
  s = removeBoilerplateSentences(s);
  s = fixMissingSpaceAfterPeriods(s);
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

function sanitizeInline(input: string): string {
  if (!input) return "";
  let s = he.decode(input);
  s = stripHtml(s);
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

const BOILERPLATE_PATTERNS: RegExp[] = [
  /\brecipe\s+video\s+(?:above|below)\b[:.]?/i,
  /\bvideo\s+(?:above|below)\b[:.]?/i,
  /\bsee\s+(?:notes?|tips?)(?:\s+below)?\b[:.]?/i,
];
function removeBoilerplateSentences(input: string): string {
  let s = input;
  for (const rx of BOILERPLATE_PATTERNS) {
    s = s.replace(new RegExp(`(^|\\s)${rx.source}(?=\\s|$)`, "gi"), " ");
  }
  return s;
}
function fixMissingSpaceAfterPeriods(input: string): string {
  return input.replace(/\.([A-Z])/g, ". $1");
}

function normalizeTags({ raw, title }: { raw?: string[]; title?: string }): string[] {
  const text = `${(title ?? "").toLowerCase()} ${(raw ?? []).join(" ").toLowerCase()}`;
  const out: string[] = [];
  scanAndPush(out, text, COURSE_KEYS);
  scanAndPush(out, text, PROTEIN_KEYS);
  scanAndPush(out, text, DIET_KEYS);
  scanAndPush(out, text, METHOD_KEYS);
  scanAndPush(out, text, CUISINE_KEYS);
  scanAndPush(out, text, ADJECTIVE_KEYS);
  if (/\b(quick|weeknight|easy|simple|fast|under\s*\d+\s*min)/i.test(text)) push(out, "Easy");
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

const CANONICAL: Record<string, string> = {
  breakfast: "Breakfast", brunch: "Brunch", lunch: "Lunch", dinner: "Dinner",
  dessert: "Dessert", soup: "Soup", salad: "Salad", side: "Side",
  appetizer: "Appetizer", starter: "Appetizer", snack: "Snack",
  chicken: "Chicken", beef: "Beef", pork: "Pork", lamb: "Lamb",
  turkey: "Turkey", duck: "Duck", fish: "Fish", seafood: "Seafood",
  salmon: "Seafood", tuna: "Seafood", shrimp: "Seafood", prawn: "Seafood", prawns: "Seafood",
  tofu: "Tofu", tempeh: "Tempeh", egg: "Egg",
  vegan: "Vegan", vegetarian: "Vegetarian",
  "gluten free": "Gluten-Free", "gluten-free": "Gluten-Free",
  "dairy free": "Dairy-Free", "dairy-free": "Dairy-Free",
  keto: "Keto", paleo: "Paleo", "low carb": "Low-Carb", "low-carb": "Low-Carb",
  easy: "Easy", quick: "Easy", weeknight: "Easy",
  "one pot": "One-Pot", "one-pot": "One-Pot", "one pan": "One-Pan",
  "sheet pan": "Sheet-Pan", "sheet-pan": "Sheet-Pan",
  "slow cooker": "Slow Cooker", "instant pot": "Instant Pot", "air fryer": "Air Fryer",
  grill: "Grill", bbq: "BBQ", baked: "Baked", roasted: "Roasted",
  "stir fry": "Stir-Fry", "stir-fry": "Stir-Fry",
  italian: "Italian", mexican: "Mexican", indian: "Indian", chinese: "Chinese",
  thai: "Thai", japanese: "Japanese", korean: "Korean", greek: "Greek",
  french: "French", spanish: "Spanish", lebanese: "Lebanese",
  "middle eastern": "Middle Eastern", vietnamese: "Vietnamese",
  spicy: "Spicy", healthy: "Healthy", creamy: "Creamy",
};

const COURSE_KEYS = ["breakfast", "brunch", "lunch", "dinner", "dessert", "soup", "salad", "side", "appetizer", "starter", "snack"];
const PROTEIN_KEYS = ["chicken", "beef", "pork", "lamb", "turkey", "duck", "fish", "seafood", "salmon", "tuna", "shrimp", "prawn", "prawns", "tofu", "tempeh", "egg"];
const DIET_KEYS = ["vegan", "vegetarian", "gluten free", "gluten-free", "dairy free", "dairy-free", "keto", "paleo", "low carb", "low-carb"];
const METHOD_KEYS = ["easy", "quick", "weeknight", "one pot", "one-pot", "one pan", "sheet pan", "sheet-pan", "slow cooker", "instant pot", "air fryer", "grill", "bbq", "baked", "roasted", "stir fry", "stir-fry"];
const CUISINE_KEYS = ["italian", "mexican", "indian", "chinese", "thai", "japanese", "korean", "greek", "french", "spanish", "lebanese", "middle eastern", "vietnamese"];
const ADJECTIVE_KEYS = ["spicy", "healthy", "creamy"];
