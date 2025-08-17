// app/recipes/page.tsx
import fs from "node:fs/promises";
import path from "node:path";
import ClientRecipesGrid from "./ClientRecipesGrid";

export const revalidate = 0; // fine here (server file)

export default async function RecipesPage() {
  const file = await fs.readFile(path.join(process.cwd(), "public", "recipes.json"), "utf8");
  const recipes = JSON.parse(file);
  return <ClientRecipesGrid recipes={recipes} />;
}
