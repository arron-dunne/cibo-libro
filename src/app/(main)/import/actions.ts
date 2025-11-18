"use server";

import { redirect } from "next/navigation";
import ky from "ky";
import { z } from "zod";
import { load as loadHtml } from "cheerio";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { uniqueRecipeSlug } from "@/lib/uniqueSlug";
import { detectPaywall } from "@/lib/import/detectPaywall";
import { isDenylisted } from "@/lib/import/denylist";
import { isSafeUrl } from "@/lib/import/safeUrl";
import { parseJsonLd, StructuredRecipe } from "@/lib/import/jsonld";
import { extractOpenGraph, OpenGraphMeta } from "@/lib/import/opengraph";


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

  // Check blockers before fetching
  const denied = isDenylisted(url.hostname.toLowerCase());
  const robotsAllowed = denied ? true : await isRobotsAllowed(url);

  // Always fetch page for OG data (used on link card fallback)
  const { ok, status, html, og } = await fetchHtmlWithMeta(url);

  // Denylisted
  if (denied) {
    await failJob(job.id, "DENYLIST");
    redirect(buildLinkCardUrl(url, og));
  }

  // Robots.txt
  if (!robotsAllowed) {
    await failJob(job.id, "ROBOTS");
    redirect(buildLinkCardUrl(url, og));
  }

  // Fetch failed
  if (!ok || !html) {
    await failJob(job.id, "ERROR", `FETCH_FAILED_${status ?? "0"}`);
    redirect(buildLinkCardUrl(url, og));
  }

  // Paywall detection via JSON-LD
  if (detectPaywall(html)) {
    await failJob(job.id, "PAYWALL");
    redirect(buildLinkCardUrl(url, og));
  }

  // JSON-LD
  const jsonldRecipe = parseJsonLd(html);
  if (jsonldRecipe) {
    const slug = await saveRecipe(userId, url.toString(), jsonldRecipe);
    await succeedJob(job.id);
    redirect(`/view/${slug}`);
  }

  // TODO: Release 1
  // Microdata
  // const microdataRecipe = parseMicrodata(html);
  // if (microdataRecipe) {
  //   saveRecipe(userId, url.toString(), microdataRecipe);
  //   return;
  // }

  // if no data extracted, redirect to link card
  await failJob(job.id, "NO_SCHEMA");
  redirect(buildLinkCardUrl(url, og));
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

// fetch HTML and basic OG from URL
async function fetchHtmlWithMeta(
  url: URL,
): Promise<{ ok: boolean; status?: number; html?: string; og?: OpenGraphMeta }> {
  try {
    // fetch URL with the safe fetcher (URL checking)
    const res = await safeFetcher.get(url);
    const status = res.status;

    if (!res.ok) return { ok: false, status };

    // parse HTML and then extract any OpenGraph data
    const html = await res.text();
    const og = await extractOpenGraph(html);

    return { ok: true, status, html, og };
  } catch(e) {
    // status 1 means unsafe URL
    if (e instanceof UnsafeUrlError) return {ok: false, status:1}
    return { ok: false };
  }
}

// Save the recipe in the database and then redirect to the view recipe page
async function saveRecipe(
  userId: string,
  sourceUrl: string,
  recipe: StructuredRecipe,
): Promise<string> {

  // sourceUrl should of been checked when initially fetching so this should never throw
  if (!(await isSafeUrl(sourceUrl))) throw Error("unsafe url");

  const title = (recipe.title || getTitleFromUrl(new URL(sourceUrl))).trim();
  const slug = await uniqueRecipeSlug(title);

  const created = await prisma.recipe.create({
    data: {
      ownerId: userId,
      type: "EXTERNAL_FULL",
      title,
      description: recipe.description ?? "",
      prepMins: recipe.prepMins ?? null,
      cookMins: recipe.cookMins ?? null,
      servings: recipe.servings ?? null,
      ingredients: recipe.ingredients ?? [],
      steps: recipe.instructions ?? [],
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
    select: { slug: true },
  });

  return created.slug
}

// build the url for link card with open graph data if available
function buildLinkCardUrl(u: URL, og?: OpenGraphMeta) {
  const title = (og?.title?.trim() || getTitleFromUrl(u)).slice(0, 120);
  const params = new URLSearchParams({ url: u.toString(), title });
  if (og?.image) params.set("image", og.image);
  if (og?.description) params.set("description", og.description.slice(0, 500));
  return `/import/link?${params.toString()}`;
}

// fallback title derived from URL's last path segment
function getTitleFromUrl(u: URL): string {
  const last = decodeURIComponent(u.pathname.split("/").filter(Boolean).pop() || u.hostname);
  const s = last
    .replace(/\.(html?|php|aspx?)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\d+\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return s ? s.replace(/\b\w/g, (c) => c.toUpperCase()) : u.hostname.replace(/^www\./, "");
}

// Update the job to FAILED with optional info
async function failJob(jobId: string, reason: ImportFailReason, message?: string) {
  await prisma.importJob.update({
    where: { id: jobId },
    data: { status: "FAILED", errorMsg: message ?? reason },
  });
}

// Update the job to SUCCESS
async function succeedJob(jobId: string) {
  await prisma.importJob.update({
    where: { id: jobId },
    data: { status: "SUCCESS" },
  });
}


