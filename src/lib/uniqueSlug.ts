import { prisma } from "@/lib/prisma";

export async function uniqueRecipeSlug(baseTitle: string) {
  const base = slugify(baseTitle) || "recipe";
  let candidate = base;
  let n = 2;
  while (await prisma.recipe.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${n++}`;
  }
  return candidate;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
