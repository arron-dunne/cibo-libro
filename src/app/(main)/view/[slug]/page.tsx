import { notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import {
  TagIcon,
  Timer,
  Utensils,
  Info,
} from "lucide-react";
import { RecipeImage } from "@/app/components/recipes/RecipeImage";
import { Header, SubHeader } from "@/app/components/text/Headers";
import { Tag } from "@/app/components/tags/Tags";
import { ButtonBar } from "./ButtonBar";
import { RecipeType } from "@/types/recipe";

export default async function ViewRecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();

  const { slug } = await params;

  const recipe = await prisma.recipe.findFirst({
    where: { slug, ownerId: session?.user.id },
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
      isFavourite: true,
    },
  });

  if (!recipe) return notFound();

  // Normalize timing
  const prep = recipe.prepMins ?? 0;
  const cook = recipe.cookMins ?? 0;
  // const total = prep + cook;

  return (
    <>
      <ButtonBar
        slug={slug}
        isFavorite={recipe.isFavourite}
        recipeType={recipe.type as RecipeType}
        sourceUrl={recipe.sourceUrl || null}
      />
      {/* <div className="mt-8 flex justify-between items-center">
      </div> */}

      {/* Hero section */}
      <section className="mt-4 flex flex-col md:flex-row gap-4 md:gap-8">
        {/* Image */}
        {(recipe.imageKey || recipe.imageExternalUrl) && (
          <div className="relative w-full md:w-1/2 min-h-none max-h-92 md:min-h-92 md:max-h-112 overflow-hidden rounded-4xl border border-white/80">
            <RecipeImage
              imageKey={recipe.imageKey ?? undefined}
              externalUrl={recipe.imageExternalUrl ?? undefined}
              alt={recipe.title || "Recipe image"}
            />
          </div>
        )}

        {/* Details */}
        <div className="w-full h-full md:w-1/2 pl-2 md:ml-0 mt-0 md:mt-12 flex flex-col justify-between">
          <Header>{recipe.title}</Header>

          <SubHeader className="mt-4">{recipe.description || ""}</SubHeader>

          {recipe.tags.length > 0 && (
            <div className="ml-2 mt-6 flex items-center flex-wrap gap-2">
              <TagIcon className="text-slate-800" size={20} />
              {recipe.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}

          {/* Timing */}
          {recipe.type !== "EXTERNAL_LINK" && (
            <>
              <div className="ml-2 mt-6 text-slate-800 flex items-center gap-4">
                <Timer size={22} />

                <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                  <div className="flex items-center gap-4">
                    <p className="shrink-0">Prep:</p>
                    <p className="text-lg font-bold">{prep} mins</p>
                  </div>

                  <span className="hidden md:block my-auto w-2 h-2 mx-2 rounded-full bg-linear-to-r from-orange-500 to-rose-500"></span>

                  <div className="flex items-center gap-4">
                    <p className="shrink-0">Cook:</p>
                    <p className="text-lg font-bold">{cook} mins</p>
                  </div>
                </div>

                {/* <div className="flex items-center gap-2">
                <Image className="size-8" src="/icons/stopwatch.png" width={512} height={512} alt="stopwatch"/>
                <p>Total</p>
                <p className="ml-4 text-xl">{total}m</p>
              </div> */}
                {/* <span className="my-auto w-2 h-2 rounded-full bg-linear-to-r from-orange-500 to-rose-500"></span> */}
              </div>

              {/* Servings */}
              <div className="ml-2 mt-6">
                <div className="flex items-center text-slate-800 gap-4">
                  <Utensils size={20} />
                  {/* <Image
                className="size-8"
                src="/icons/serving-dish-bw.png"
                width={512}
                height={512}
                alt="serving dish"
              /> */}
                  <p>Serves:</p>
                  <p className="ml-4 text-lg font-bold">
                    {String(recipe.servings ?? 1)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Steps and Ingredients */}
      {recipe.type === "EXTERNAL_LINK" ? (
        <LinkCardInfoSection />
      ) : (
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
    <section className="h-max w-full md:w-1/3 lg:w-2/5 rounded-4xl bg-white p-8">
      <h2 className="mb-4 text-2xl font-extrabold text-slate-800">
        Ingredients
      </h2>
      {ingredients.length ? (
        <ul className="ml-2 space-y-4">
          {ingredients.map((ing, idx) => (
            <li key={`ing-${idx}`} className="flex gap-4 text-md">
              <div className="z-10 h-2 w-2 mt-2 shrink-0 rounded-full bg-linear-to-r from-orange-500 to-rose-500" />
              {ing}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-800">No ingredients yet.</p>
      )}
    </section>
  );
}

function StepsSection({ steps }: { steps: string[] }) {
  return (
    <section className="h-max w-full md:w-2/3 lg:w-3/5 rounded-4xl bg-white p-8">
      <h2 className="mb-4 text-2xl font-extrabold">Steps</h2>
      {steps.length ? (
        <ol className="relative space-y-6 ml-2 before:absolute before:left-2.5 before:top-1 before:h-[98%] before:w-1 before:z-10 before:rounded before:bg-linear-to-b before:from-orange-200 before:to-rose-200">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <div className="z-20 h-6 w-6 mt-0.5 text-center shrink-0 rounded-full bg-linear-to-r from-orange-500 to-rose-500 font-extrabold text-white shadow">
                {i + 1}
              </div>
              <p className="text-base leading-relaxed">{s}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-slate-800">No steps yet.</p>
      )}
    </section>
  );
}

function LinkCardInfoSection() {
  return (
    <div className="mt-8 w-full rounded-2xl px-4 md:px-8 py-4 text-base md:text-lg text-slate-800 font-semibold bg-white flex gap-3 items-center">
      <Info size={28} className="text-orange-600 shrink-0" />
      We couldn&apos;t import the full recipe so we saved this handy link card back
      to the original.
    </div>
  );
}
