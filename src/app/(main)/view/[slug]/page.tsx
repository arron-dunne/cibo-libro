import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Pencil, ChefHat, Trash2, ArrowLeft } from "lucide-react";
import { RecipeImage } from "@/app/components/recipes/RecipeImage";
import { deleteRecipe } from "./actions";
import { DeleteButton } from "./DeleteButton";

export default async function ViewRecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = await params.then((p) => p.slug);

  const recipe = await prisma.recipe.findFirst({
    where: { slug: slug },
    select: {
      id: true,
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
      sourceUrl: true
    },
  });

  if (!recipe) return notFound();

  // Normalize shapes
  const tags: string[] = Array.isArray(recipe.tags) ? recipe.tags : [];
  const ingredients: string[] = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : [];
  const steps: string[] = Array.isArray(recipe.steps) ? recipe.steps : [];

  const prep = Number(recipe.prepMins ?? 0);
  const cook = Number(recipe.cookMins ?? 0);
  const total = prep + cook;

  // pretty domain for the badge
  const domain =
    recipe.sourceUrl
      ? new URL(recipe.sourceUrl).hostname.replace(/^www\./, "")
      : null;


  return (
    <div className="space-y-6">

      {/* Button bar */}
      <div className="w-full flex gap-2 justify-between md:gap-4 text-md font-semibold">
        {/* Back button */}
        <Link
          href="/all"
          className="inline-flex items-center gap-2 rounded-full border border-white/70 text-slate-700 bg-gradient-to-r from-slate-200 to-slate-300 shadow-lg cursor-pointer transition hover:brightness-90 active:brightness-75 px-4 py-2"
        >
          <ArrowLeft className="h-4 w-4" />
          All Recipes
        </Link>

        {/* Edit */}
        <Link
          href={`/edit/${slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-black/5 transition hover:bg-orange-700 active:bg-orange-800"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>

        {/* Delete */}
        <DeleteButton action={deleteRecipe} slug={slug} />

        {/* Cook Mode button */}
        {recipe.type !== "EXTERNAL_LINK" && (
          <Link
            href={`/cook/${slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-white shadow-sm ring-1 ring-black/5 transition hover:bg-orange-700 active:bg-orange-800"
          >
            <ChefHat className="h-4 w-4" />
            Cook
          </Link>
        )}
      </div>

      {/* Hero section */}
      <section className="overflow-hidden rounded-3xl border border-white/40 bg-white shadow-2xl min-h-[50vh] flex">
        <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
          {/* Image */}
          <div className="relative h-full overflow-hidden">
            <div className="absolute inset-0 w-full h-full object-cover">
              <RecipeImage
                imageKey={recipe.imageKey ?? undefined}
                externalUrl={recipe.imageExternalUrl ?? undefined}
                alt={recipe.title || "Recipe image"}
              />
            </div>
          </div>

          {/* Title + meta */}
          <div className="relative p-5 md:p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
              {recipe.title || "Untitled recipe"}
            </h1>

            {tags.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-sm font-medium text-orange-700 text-nowrap"
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

            {recipe.description ? (
              <p className="mt-4 max-w-prose text-sm text-slate-600">
                {recipe.description}
              </p>
            ) : (
              <p className="mt-4 max-w-prose text-sm italic text-slate-400">
                No description provided.
              </p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatChip label="Prep" value={`${prep}m`} />
              <StatChip label="Cook" value={`${cook}m`} />
              <StatChip label="Total" value={`${total}m`} />
              <StatChip label="Serves" value={String(recipe.servings ?? 1)} />
            </div>

            {/* View original (only if we have a sourceUrl) */}
            {recipe.sourceUrl && (
              <div className="mt-5 self-end">
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View original on ${domain ?? "source site"}`}
                  className="
        inline-flex items-center gap-2 rounded-full
        border border-orange-200 bg-orange-50/80
        px-3 py-1.5 text-sm font-semibold text-orange-800
        shadow-sm ring-1 ring-black/5
      "
                >
                  {/* icon */}
                  <svg
                    className="h-4 w-4 text-orange-600"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"
                  >
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                    <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  </svg>

                  <span className="tracking-tight">View original</span>

                  {domain && (
                    <span
                      className="
            ml-1 rounded-full border border-orange-200
            bg-white/80 px-2 py-0.5 text-xs font-medium text-orange-700
          "
                    >
                      {domain}
                    </span>
                  )}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTENT: two-column */}
      <section className="grid items-start gap-6 md:grid-cols-[0.9fr_1.1fr]">
        {/* LEFT COLUMN */}
        <div className="grid gap-6">
          <Card title="Ingredients">
            {ingredients.length ? (
              <ul className="space-y-3">
                {ingredients.map((it, idx) => (
                  <li
                    key={`ing-${idx}`}
                    className="rounded-xl border border-orange-200/70 bg-white px-3 py-2 text-sm"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600">No ingredients.</p>
            )}
          </Card>

          {/* <Card title="Notes">
            <p className="text-sm text-slate-600">No notes yet.</p>
          </Card>

          <Card title="Serve with">
            <p className="text-sm text-slate-600">Add sides or pairings.</p>
          </Card> */}
        </div>

        {/* RIGHT COLUMN */}
        <div className="grid gap-6">
          <Card id="steps" title="Steps">
            {steps.length ? (
              <ol className="relative ml-3 space-y-6 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded before:bg-gradient-to-b before:from-orange-200 before:to-rose-200">
                {steps.map((s, i) => (
                  <li key={i} className="relative pl-6">
                    <div className="absolute left-0 top-1 -translate-x-1/2 grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-[11px] font-extrabold text-white shadow">
                      {i + 1}
                    </div>
                    <p className="text-base leading-relaxed">{s}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-slate-600">No steps yet.</p>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}

/* ====== tiny SSR helpers (no client state) ====== */

function Card({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="overflow-hidden rounded-3xl border border-white/40 bg-white p-5 shadow-xl md:p-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-orange-500" />
        <h2 className="text-lg font-extrabold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-full border border-orange-200/70 bg-orange-50 px-3 py-1.5 text-xs font-semibold">
      <span className="text-slate-600">{label}</span>
      <span className="text-slate-900 col-start-3">{value}</span>
    </div>
  );
}
