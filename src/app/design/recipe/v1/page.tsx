import path from "node:path";
import fs from "node:fs/promises";
import ClientRecipe from "./ClientRecipe";

// Keep these types in sync with your ClientRecipe.tsx
export type Step = { text: string; timerSec?: number };
export type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  servings: number;
  ingredients: string[];
  steps: Step[];
  notes?: string;
  isOwned?: boolean;
  sourceUrl?: string | null;
};

async function loadRecipe(): Promise<Recipe> {
  // Read /public/recipe.json directly from the filesystem
  const filePath = path.join(process.cwd(), "public", "recipe.json");
  const file = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(file);

  // Light normalization/guards so the page never crashes if a field is missing
  return {
    id: data.id ?? "recipe",
    title: data.title ?? "Untitled Recipe",
    description: data.description ?? "",
    imageUrl: data.imageUrl ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    prepMinutes: Number(data.prepMinutes ?? 0),
    cookMinutes: Number(data.cookMinutes ?? 0),
    totalMinutes: Number(data.totalMinutes ?? (Number(data.prepMinutes ?? 0) + Number(data.cookMinutes ?? 0))),
    servings: Number(data.servings ?? 1),
    ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
    steps: Array.isArray(data.steps) ? data.steps : [],
    notes: data.notes ?? "",
    isOwned: data.isOwned ?? true,
    sourceUrl: data.sourceUrl ?? null,
  };
}

export default async function Page() {
  const recipe = await loadRecipe();
  return <ClientRecipe recipe={recipe} />;
}
