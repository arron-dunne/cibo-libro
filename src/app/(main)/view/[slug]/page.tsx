import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Pencil,
  ChefHat,
  ArrowLeft,
  Heart,
  Link as LinkIcon,
  TagIcon,
} from "lucide-react";
import { RecipeImage } from "@/app/components/recipes/RecipeImage";
import { deleteRecipe } from "./actions";
import { DeleteButton } from "./DeleteButton";
import { getHostname } from "@/lib/hostname";

export default async function ViewRecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = await params.then((p) => p.slug);

  const recipe = await prisma.recipe.findFirst({
    where: { slug: slug },
    select: {
      title: true,
      type: true,
      description: true,
      tags: true,
      prepMins: true,
      cookMins: true,
      servings: true,
      ingredients: true,
      steps: true,
      imageKey: true,
      imageExternalUrl: true,
      sourceUrl: true,
    },
  });

  if (!recipe) return notFound();

  // Normalize timing
  const prep = Number(recipe.prepMins ?? 0);
  const cook = Number(recipe.cookMins ?? 0);
  const total = prep + cook;

  return (
    <>
      {/* Back button */}
      <Link
        href="/all"
        className="w-max flex items-center gap-3 text-lg font-semibold text-slate-900 cursor-pointer hover:brightness-90 active:brightness-75"
      >
        <div className="p-1.5 rounded-full border border-white/80 bg-linear-to-br from-slate-200 to-slate-300 shadow-lg">
          <ArrowLeft size={20} />
        </div>
        All Recipes
      </Link>

      {/* Hero section */}
      <section className="h-max relative mt-4 overflow-hidden rounded-4xl border border-white/60 bg-white shadow-2xl flex flex-col md:flex-row">
        {/* Source URL */}
        {recipe.sourceUrl && (
          <Link
            href={recipe.sourceUrl}
            target="_blank"
            aria-label="View original"
            className="absolute top-4 right-4 px-3 py-2 flex gap-2 items-center
          bg-linear-to-br from-slate-100 to-slate-200
          rounded-full text-slate-800 border border-slate-300
          cursor-pointer hover:brightness-90 active:brightness-75"
          >
            <LinkIcon size={20} />
            <p className="text-sm">{getHostname(recipe.sourceUrl)}</p>
          </Link>
        )}

        {/* Image */}
        <div className="w-full md:w-1/2 max-h-100 md:max-h-none overflow-hidden md:relative">
          <div className="md:absolute md:inset-0">
            <RecipeImage
              imageKey={recipe.imageKey ?? undefined}
              externalUrl={recipe.imageExternalUrl ?? undefined}
              alt={recipe.title || "Recipe image"}
            />
          </div>
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 mt-4 md:mt-8 p-5 md:p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-5xl font-extrabold leading-tight ">
              {recipe.title}
            </h1>

            {recipe.description ? (
              <p className="mt-4 max-w-prose text-sm text-slate-600">
                {recipe.description}
              </p>
            ) : (
              <p className="mt-4 max-w-prose text-sm italic text-slate-400">
                No description provided.
              </p>
            )}

            {recipe.tags.length ? (
              <div className="mt-4 flex items-center flex-wrap gap-2">
                <TagIcon size={16} />
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-linear-to-br from-orange-100 to-rose-100 text-rose-500 border border-rose-200 px-3 py-1 font-medium text-nowrap"
                  >
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <span className="h-6 w-20 rounded-full bg-slate-100" />
                <span className="h-6 w-14 rounded-full bg-slate-100" />
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2 sm:grid-cols-4">
              <StatChip label="Prep" value={`${prep}m`} />
              <StatChip label="Cook" value={`${cook}m`} />
              <StatChip label="Total" value={`${total}m`} />
              <StatChip label="Serves" value={String(recipe.servings ?? 1)} />
            </div>
          </div>

          {/* Button bar  */}
          <div className="mt-6 flex gap-2">
            {/* TODO: refactor secondary button */}
            <button
              className="px-3 h-11 flex gap-2 items-center
              bg-linear-to-br from-slate-100 to-slate-200
              rounded-full text-slate-800 border border-slate-300
              cursor-pointer hover:brightness-90 active:brightness-75"
            >
              <Heart size={20} />
              <span className="hidden lg:block">Favourite</span>
            </button>

            <Link
              href={`/edit/${slug}`}
              className="px-3 h-11 flex gap-2 items-center
                bg-linear-to-br from-slate-100 to-slate-200
                rounded-full text-slate-800 border border-slate-300
                cursor-pointer hover:brightness-90 active:brightness-75"
            >
              <Pencil size={20} />
              <span className="hidden lg:block">Edit</span>
            </Link>

            <DeleteButton slug={slug} action={deleteRecipe} />

            {recipe.type != "EXTERNAL_LINK" && (
              <Link
                href={`/cook/${slug}`}
                className="px-3 h-11 flex gap-3 items-center ml-auto flex-nowrap
                bg-linear-to-br from-orange-500 to-rose-500
                rounded-full text-white font-bold border
                cursor-pointer hover:brightness-90 active:brightness-75"
              >
                <ChefHat size={20} className="-rotate-12 shrink-0" />
                <span className="text-nowrap">Start Cooking</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Steps and Ingredients */}
      {recipe.type != "EXTERNAL_LINK" && (
        <section className="mt-8 flex flex-col md:flex-row gap-8">
          <IngredientsSection ingredients={recipe.ingredients} />
          <StepsSection steps={recipe.steps} />
        </section>
      )}
    </>
  );
}

function IngredientsSection({ ingredients }: { ingredients: string[] }) {
  return (
    <section className="h-max w-full md:w-1/3 lg:w-2/5 rounded-4xl border border-white/60 bg-white shadow-xl p-6">
      <h2 className="mb-4 ml-2 text-2xl font-extrabold">Ingredients</h2>
      {ingredients.length ? (
        <ul className="space-y-4">
          {ingredients.map((ing, idx) => (
            <li key={`ing-${idx}`} className="flex gap-2">
              <div className="h-2 w-2 mt-2 shrink-0 rounded-full bg-orange-400" />
              {ing}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-800">No ingredients.</p>
      )}
    </section>
  );
}

function StepsSection({ steps }: { steps: string[] }) {
  return (
    <section className="h-max w-full md:w-2/3 lg:w-3/5 rounded-4xl border border-white/60 bg-white shadow-xl p-6">
      <h2 className="mb-4 ml-2 text-2xl font-extrabold">Steps</h2>
      {steps.length ? (
        <ol className="relative space-y-6 before:absolute before:left-2.5 before:top-1 before:h-[98%] before:w-1 before:rounded before:bg-linear-to-b before:from-orange-200 before:to-rose-200">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <div className="h-6 w-6 z-10 mt-0.5 text-center shrink-0 rounded-full bg-orange-500 font-extrabold text-white shadow">
                {i + 1}
              </div>
              <p className="text-base leading-relaxed">{s}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-slate-600">No steps yet.</p>
      )}
    </section>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="grow max-w-36 min-w-26 flex justify-between items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-semibold">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
