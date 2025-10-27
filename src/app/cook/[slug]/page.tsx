// app/cook/[slug]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CookModeClient from "./CookModeClient";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>;
}) {
  const slug = await params.then(p => p.slug);

  const sp = ((await searchParams) ?? {}) as SearchParams;
  const stepParamRaw = Array.isArray(sp.step) ? sp.step[0] : sp.step;
  const initialStep = (stepParamRaw ?? "ings").toString().toLowerCase();

  // Fetch only what Cook Mode needs
  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      ingredients: true, // string[]
      steps: true,       // string[]
    },
  });

  if (!recipe) notFound();

  const title = recipe.title ?? "Untitled Recipe";
  const ingredients: string[] = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const steps: string[] = Array.isArray(recipe.steps) ? recipe.steps : [];

  return (
    <CookModeClient 
      slug={slug}
      title={title}
      ingredients={ingredients}
      steps={steps}
      initialStep={initialStep}
    />
  );
}