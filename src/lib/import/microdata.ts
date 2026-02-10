import { load } from "cheerio";
import { parseIsoDurationMinutes } from "./helpers";
import { StructuredRecipe } from "./jsonld";

export function parseMicrodata(html: string): StructuredRecipe | null {
  const $ = load(html);
  const root = $(
    '[itemscope][itemtype*="schema.org/Recipe"], [itemscope][itemtype*="Schema.org/Recipe"]',
  ).first();
  if (!root.length) return null;

  const getText = (sel: string) => {
    const el = root.find(sel).first();
    const content = el.attr("content");
    return (content ?? el.text() ?? "").trim();
  };

  const title =
    getText('[itemprop="name"]') || $("title").first().text().trim();
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

  // const servings = maybeNumber(getText('[itemprop="recipeYield"]'));
  const prepMins = parseIsoDurationMinutes(
    getText('[itemprop="prepTime"]') || null,
  );
  const cookMins = parseIsoDurationMinutes(
    getText('[itemprop="cookTime"]') || null,
  );

  if (!title || (!ingredients.length && !instructions.length)) return null;

  return {
    title,
    description,
    image,
    ingredients: ingredients.length ? ingredients : undefined,
    instructions: instructions.length ? instructions : undefined,
    // servings,
    prepMins,
    cookMins,
  };
}
