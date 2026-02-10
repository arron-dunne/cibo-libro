import { redirect } from "next/navigation";
import { ClientRecipesGrid } from "./ClientRecipesGrid";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { SORT_OPTIONS, SortOptionKey } from "./options";

export type RecipeCardRecipe = {
  title: string;
  description?: string;
  prepMins?: number | null;
  cookMins?: number | null;
  servings?: number | null;
  imageKey?: string | null;
  imageExternalUrl?: string | null;
  tags?: string[];
  note?: string;
  sourceUrl?: string | null;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string; tags?: string[] }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const params = await searchParams;

  const sortParam: SortOptionKey = getValidSortKey(params.sort ?? null);
  const searchParam: string = params.search ?? "";
  const tagsParam: string[] = params.tags ?? [];

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

  const recipes: RecipeCardRecipe[] = rows.map((r) => ({
    title: r.title ?? "",
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
    updatedAt: r.updatedAt,
  }));

  return (
    <ClientRecipesGrid
      recipes={recipes}
      initialSearch={searchParam}
      initialSort={sortParam}
      initialTags={tagsParam}
    />
  );
}

// Takes the URL param for sort and returns a valid SortKeyOption at runtime
function getValidSortKey(param: string | null): SortOptionKey {
  const validKeys = SORT_OPTIONS.map((opt) => opt.key);
  return validKeys.includes(param as SortOptionKey)
    ? (param as SortOptionKey)
    : "updated"; // fallback
}
