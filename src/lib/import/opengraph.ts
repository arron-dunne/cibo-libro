import { load } from "cheerio";
import { isSafeUrl } from "./safeUrl";

const MAX_DESCRIPTION_LENGTH = 500;

export type OpenGraphMeta = {
  title?: string;
  description?: string;
  image?: string;
};

// Extract Open Graph metadata from HTML, returning a validated object
// with a safe image URL and truncated description
export async function extractOpenGraph(html: string): Promise<OpenGraphMeta> {
  const $ = load(html);
  const get = (prop: string) =>
    $(`meta[property="${prop}"]`).attr("content") ||
    $(`meta[name="${prop}"]`).attr("content") ||
    undefined;

  const title = get("og:title") || $("title").first().text().trim() || undefined;

  const rawDescription = get("og:description");
  const description = rawDescription
    ? rawDescription.slice(0, MAX_DESCRIPTION_LENGTH)
    : undefined;

  const rawImage = get("og:image");
  const image = rawImage && (await isSafeUrl(rawImage)) ? rawImage : undefined;

  return { title, description, image };
}
