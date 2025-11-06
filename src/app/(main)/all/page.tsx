import { redirect } from "next/navigation";
import { ClientRecipesGrid } from "./ClientRecipesGrid";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

  interface RecipeCardRecipe {
    title: string;
    description?: string;
    prepMins?: number | null;
    cookMins?: number | null;
    servings?: number | null;
    imageKey?: string | null;
    imageExternalUrl?: string | null;
    tags?: string[];
    note?: string
    sourceUrl?: string | null;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
  }

export default async function RecipesPage({ 
  searchParams 
} : {
  searchParams: Promise<{ search?: string, sort?: string}>
}) {
  
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { search: searchParam = "", sort: sortParam = "" } = await searchParams;

  // Pull all fields we need for the grid, including the external image URL.
  const rows = await prisma.recipe.findMany({
    where: { ownerId: session.user.id as string },
    orderBy: { updatedAt: "desc" },
    select: {
      title: true,
      slug: true,
      description: true,
      imageKey: true,
      imageExternalUrl: true,
      tags: true,
      prepMins: true,
      cookMins: true,
      servings: true,
      sourceUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  console.log(new Date(rows[0].createdAt).getTime())

  const recipes: RecipeCardRecipe[] = rows.map((r) => ({
    title: r.title ?? "Untitled recipe",
    slug: r.slug ?? null,
    description: r.description ?? "",
    imageKey: r.imageKey ?? null,
    imageExternalUrl: r.imageExternalUrl ?? null,
    tags: r.tags ?? [],
    prepMins: r.prepMins ?? null,
    cookMins: r.cookMins ?? null,
    servings: r.servings ?? null,
    sourceUrl: r.sourceUrl ?? null,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt
  }));

  // sort
  switch (sortParam) {
    case "az":
      recipes.sort((a, b) => a.title.localeCompare(b.title))
      break;
    case "created":
      recipes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break;
  }

  return <ClientRecipesGrid recipes={recipes} sort={sortParam}/>;
}
