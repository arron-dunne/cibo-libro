import { load } from "cheerio";
import { parseIsoDurationMinutes } from "./helpers";

export type StructuredRecipe = {
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

// This parser intentionally favors simplicity and robustness over full JSON-LD compliance
// It extracts the first inline Recipe node and ignores graph references
export function parseJsonLd(html: string): StructuredRecipe | null {
  const $ = load(html);
  const allJsonld = $('script[type="application/ld+json"]');
  if (!allJsonld.length) return null;

  const data: Object[] = [];
  allJsonld.each((_, el) => {
    const raw = $(el).contents().text().trim();
    if (!raw) return;
    try {
      data.push(JSON.parse(raw));
    } catch {
      // ignore malformed JSON-LD
    }
  });

  if (data.length < 1) return null;

  // Find the first Recipe anywhere in the JSON-LD
  const recipeNode = findRecipeNode(data);
  if (recipeNode) {
    const recipe = extractRecipe(recipeNode);
    
    // Don't import recipes with no title
    if(!recipe.title || recipe.title === "") return null;
    
    return recipe;
  }

  return null;
}


export function findRecipeNode(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data != "object") return null;

  // Handle arrays
  if (Array.isArray(data)) {
    for (const elem of data) {
      const recipeNode = findRecipeNode(elem);
      if (recipeNode) return recipeNode;
    }
    return null;
  }

  // At this point, node is an object
  const obj = data as Record<string, unknown>;

  // Check for @type: Recipe
  const type = obj["@type"];
  if (
    type === "Recipe" ||
    (Array.isArray(type) && type.includes("Recipe"))
  ) {
    return obj;
  }

  // Recurse into object values
  for (const value of Object.values(obj)) {
    const recipeNode = findRecipeNode(value);
    if (recipeNode) return recipeNode;
  }

  return null;
}

export function extractRecipe(node: Record<string, unknown>): StructuredRecipe {
  return {
    title:
      typeof node["name"] === "string"
        ? node["name"].trim()
        : "",

    description:
      typeof node["description"] === "string"
        ? node["description"]
        : undefined,

    image:
      typeof node["image"] === "string"
        ? node["image"]
        : Array.isArray(node["image"])
          ? node["image"].map(String)[0]
          : undefined,

    ingredients:
      Array.isArray(node["recipeIngredient"])
        ? node["recipeIngredient"].map(String)
        : undefined,

    instructions: extractInstructions(node["recipeInstructions"]),

    servings:
      typeof node["recipeYield"] === "string" ||
        typeof node["recipeYield"] === "number"
        ? Number(node["recipeYield"])
        : undefined,

    prepMins: parseIsoDurationMinutes(node["prepTime"]),
    cookMins: parseIsoDurationMinutes(node["cookTime"]),
  };
}

export function extractInstructions(value: unknown): string[] | undefined {
  if (!value) return undefined;

  // Plain string
  if (typeof value === "string") {
    return [value];
  }

  // Array of strings or HowToStep objects
  if (Array.isArray(value)) {
    const steps = value
      .map((v) => {
        if (typeof v === "string") return v;
        if (typeof v === "object" && typeof v?.["text"] === "string") {
          return v["text"];
        }
        return null;
      })
      .filter(Boolean) as string[];

    return steps.length ? steps : undefined;
  }

  return undefined;
}