// app/all/page.tsx
import { redirect } from "next/navigation";
import ClientRecipesGrid, { type Recipe as UIRecipe } from "./ClientRecipesGrid";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const revalidate = 0; // server component; keep fresh

export default async function RecipesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Pull all fields we need for the grid, including the external image URL.
  const rows = await prisma.recipe.findMany({
    where: { ownerId: session.user.id as string },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      imageKey: true,
      imageExternalUrl: true, // ← NEW
      tags: true,
      prepMins: true,
      cookMins: true,
      servings: true,
      sourceUrl: true,
    },
  });

  const recipes: UIRecipe[] = rows.map((r) => ({
    id: r.id,
    title: r.title ?? "Untitled recipe",
    slug: r.slug ?? null,
    description: r.description ?? "",
    imageKey: r.imageKey ?? null,
    imageExternalUrl: r.imageExternalUrl ?? null, // ← NEW
    tags: r.tags ?? [],
    prepMins: r.prepMins ?? null,
    cookMins: r.cookMins ?? null,
    servings: r.servings ?? null,
    sourceUrl: r.sourceUrl ?? null,
  }));

  return <ClientRecipesGrid recipes={recipes} />;
}
