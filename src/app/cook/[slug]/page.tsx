import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CookModeClient from "./CookModeClient";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = await params.then((p) => p.slug);

  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      ingredients: true,
      steps: true,
    },
  });

  if (!recipe) notFound();

  const title = recipe.title ?? "Untitled Recipe";
  const ingredients: string[] = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : [];
  const steps: string[] = Array.isArray(recipe.steps) ? recipe.steps : [];

  return (
    <CookModeClient
      slug={slug}
      title={title}
      ingredients={ingredients}
      steps={steps}
    />
  );
}
