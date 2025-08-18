import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export async function uniqueRecipeSlug(baseTitle: string) {
  const base = slugify(baseTitle) || "recipe";
  let candidate = base;
  let n = 2;
  while (await prisma.recipe.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${n++}`;
  }
  return candidate;
}