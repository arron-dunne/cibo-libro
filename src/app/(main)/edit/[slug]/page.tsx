import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import RecipeForm from "@/app/components/recipes/RecipeForm";
import RecipeLinkForm from "@/app/components/recipes/RecipeLinkForm";
import { updateRecipe, updateRecipeLink } from "./actions";

export const dynamic = "force-dynamic";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = await params.then((p) => p.slug);

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const recipe = await prisma.recipe.findUnique({
    where: { slug: slug },
  });

  if (!recipe || recipe.ownerId !== session.user.id) notFound();

  if (recipe.type === "EXTERNAL_LINK") {
    return <RecipeLinkForm recipe={recipe} action={updateRecipeLink} />;
  }

  return <RecipeForm mode="edit" recipe={recipe} action={updateRecipe} />;
}
