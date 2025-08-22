// app/all/page.tsx
import { redirect } from "next/navigation";
import ClientRecipesGrid, { type Recipe as UIRecipe } from "./ClientRecipesGrid";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const revalidate = 0; // server component; keep fresh

export default async function RecipesPage() {
  const session = await auth();
  if (!session?.user) {
    // Not signed in → send to auth
    redirect("/signin");
  }

  // Adjust these fields to match your exact schema names.
  // This works even if some are null/undefined—we default sensibly below.
  const rows = await prisma.recipe.findMany({
    where: { ownerId: (session.user.id as string )},
    orderBy: { updatedAt: "desc" },
    // If you have relations for tags/steps/ingredients, you can include/select them here.
    // include: { tags: true } // e.g. if you have a RecipeTag[] relation
  });

  // app/recipes/page.tsx (mapper snippet)
const recipes: UIRecipe[] = rows.map((r) => ({
  id: r.id,
  title: r.title ?? "Untitled recipe",
  description: r.description ?? "",
  imageKey: r.imageKey ?? null,        // ← pass key, not URL
  tags: r.tags ?? [],
  prepMins: r.prepMins ?? null,        // ← schema names
  cookMins: r.cookMins ?? null,
  servings: r.servings ?? null,
  sourceUrl: r.sourceUrl ?? null,
}));

  return <ClientRecipesGrid recipes={recipes} />;
}
