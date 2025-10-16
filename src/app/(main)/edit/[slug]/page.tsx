import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditRecipeForm from "./EditRecipeForm";

export default async function EditRecipePage({ params }: { params: { slug: string } }) {

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const recipe = await prisma.recipe.findUnique({
    where: { slug: params.slug },
  });

  if (!recipe) notFound();
  if (recipe.ownerId !== session.user.id) redirect("/");

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Edit Recipe</h1>
      <EditRecipeForm recipe={recipe} />
    </main>
  );
}
