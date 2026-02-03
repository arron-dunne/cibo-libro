"use server";

import { redirect } from "next/navigation";
import ky from "ky";
import he from "he";
import { z } from "zod";
import { load } from "cheerio";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { uniqueRecipeSlug } from "@/lib/uniqueSlug";
import { detectPaywall } from "@/lib/import/detectPaywall";
import { isDenylisted } from "@/lib/import/denylist";
import { isSafeUrl } from "@/lib/import/safeUrl";
import { parseJsonLd, StructuredRecipe } from "@/lib/import/jsonld";


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

  // JSON-LD
  const jsonldRecipe = parseJsonLd(html);
  if (jsonldRecipe) { 
    saveRecipe(userId, url.toString(), jsonldRecipe); 
    return;
  }

  // TODO: Release 1
  // Microdata
  // const microdataRecipe = parseMicrodata(html);
  // if (microdataRecipe) { 
  //   saveRecipe(userId, url.toString(), microdataRecipe); 
  //   return;
  // }


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
async function saveRecipe(
  userId: string,
  sourceUrl: string,
  recipe: StructuredRecipe,
) {

  // sourceUrl should of been checked when initially fetching so this should never throw
  if (!(await isSafeUrl(sourceUrl))) throw Error("unsafe url");

  const title = (recipe.title || humanizeUrl(sourceUrl)).trim();
  const slug = await uniqueRecipeSlug(title);

  const created = await prisma.recipe.create({
    data: {
      ownerId: userId,
      type: "EXTERNAL_FULL",
      title,
      description: sanitizeDescription(recipe.description ?? ""),
      prepMins: recipe.prepMins ?? null,
      cookMins: recipe.cookMins ?? null,
      servings: recipe.servings ?? null,
      ingredients: (recipe.ingredients ?? []).map(sanitizeInline).filter(Boolean),
      steps: (recipe.instructions ?? []).map(sanitizeInline).filter(Boolean),
      // tags: normalizeTags({ raw: recipe.tags, title }),
      sourceUrl,
      isPublic: false,
      slug,
      // status: "PUBLISHED",
      imageExternalUrl: recipe.image 
        ? await isSafeUrl(recipe.image) 
          ? recipe.image 
          : null
        : null
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
