import { load } from "cheerio";
import { isSafeUrl } from "./safeUrl";

export type OpenGraphMeta = {
  title?: string;
  description?: string;
  image?: string;
};

// Extract Open Graph metadata from HTML, returning a validated object
// with a safe image URL
export async function extractOpenGraph(html: string): Promise<OpenGraphMeta> {
  const $ = load(html);
  const get = (prop: string) =>
    $(`meta[property="${prop}"]`).attr("content") ||
    $(`meta[name="${prop}"]`).attr("content") ||
    undefined;

  const title = get("og:title") || $("title").first().text().trim() || undefined;
  const description = get("og:description") || undefined;

  const rawImage = get("og:image");
  const image = rawImage && (await isSafeUrl(rawImage)) ? rawImage : undefined;

  return { title, description, image };
}
