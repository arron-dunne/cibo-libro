// app/cook/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma"; // ← adjust if your path differs
import {
  ArrowLeft,
  UtensilsCrossed,
  Lock,
  List,
  ListOrdered,
  Circle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type PageProps = { params: { slug: string } };

// Heuristics to normalize ingredients from different schema shapes
function normalizeIngredients(
  ingredients: unknown,
  fallbackRaw?: string | null
): string[] {
  const lines: string[] = [];

  if (Array.isArray(ingredients)) {
    for (const item of ingredients) {
      if (typeof item === "string") {
        const t = item.trim();
        if (t) lines.push(t);
      } else if (item && typeof item === "object") {
        // Support common shapes: {text}, {name, quantity|amount, unit, note}
        const obj = item as Record<string, unknown>;
        const name =
          (obj.text as string) ??
          (obj.name as string) ??
          (obj.ingredient as string) ??
          "";
        const qty =
        (obj.quantity as string) ??
        (obj.qty as string) ??
        (obj.amount as string) ??
        "";
        const unit = (obj.unit as string) ?? "";
        const note = (obj.note as string) ?? "";
        const composed = [qty, unit, name, note].filter(Boolean).join(" ").trim();
        if (composed) lines.push(composed);
      }
    }
  } else if (typeof ingredients === "string") {
    lines.push(
      ...ingredients
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }

  if (!lines.length && typeof fallbackRaw === "string" && fallbackRaw) {
    lines.push(
      ...fallbackRaw
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }

  return lines;
}

export default async function Page({ params }: PageProps) {
  const { slug } = params;

  // Fetch the recipe by slug; select minimally to stay light.
  // Adjust selected fields to match your schema.
  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      ingredients: true,
    },
  });

  if (!recipe) notFound();

  const title = (recipe.title as string) ?? "Untitled Recipe";

  // Pull from whichever field your schema uses
  const ingFromPrimary =
    (recipe as any).ingredients ?? (recipe as any).ingredientsJson;
  const ingFallback = (recipe as any).rawIngredients as string | null | undefined;
  const ingredients = normalizeIngredients(ingFromPrimary, ingFallback);

  return (
    // Let your global gradient show through
    <main className="min-h-dvh text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20">
        <div className="mx-auto max-w-screen-sm px-4 sm:px-6 py-2">
          {/* Glassy pill navbar */}
          <div className="rounded-full bg-white/35 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_6px_24px_rgba(0,0,0,0.08)] px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href={`/view/${slug}`}
                  aria-label="Back to recipe"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 ring-1 ring-white/60 shadow-sm text-gray-700 hover:bg-white transition"
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden />
                </Link>
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5 text-orange-600 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" aria-hidden />
                  <div className="leading-tight">
                    <p className="text-sm text-gray-700/90">Cook Mode</p>
                    <h1 className="text-base text-black font-semibold">{title}</h1>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50/90 ring-1 ring-emerald-200 px-3 py-1">
                  <Lock className="h-4 w-4 text-emerald-700" aria-hidden />
                  <span className="text-sm text-emerald-800">Screen awake</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-screen-sm w-full px-4 pt-4 pb-28">
        {/* Tabs row (Ingredients active) */}
        <div className="grid grid-cols-2 gap-4">
          <button
            aria-current="page"
            className="h-12 rounded-full bg-[rgba(255,255,255,0.95)] text-orange-900 ring-1 ring-black/5 shadow text-[13px] font-semibold flex items-center justify-center gap-2"
          >
            <List className="size-4" />
            Ingredients
          </button>
          <button
            className="h-12 rounded-full bg-white/35 text-white ring-1 ring-white/50 backdrop-blur shadow text-[13px] font-semibold flex items-center justify-center gap-2"
          >
            <ListOrdered className="size-4" />
            All Steps
          </button>
        </div>

        {/* Ingredients card */}
        <div className="mt-5 rounded-3xl p-5 md:p-6 bg-[rgba(255,246,240,0.96)] text-orange-950 ring-1 ring-[rgba(253,216,180,0.9)] shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-center pb-3 border-b border-[rgba(253,216,180,0.7)]/60">
            <p className="text-xs font-medium text-orange-700/80">Gather &amp; prep ingredients</p>
          </div>

          {ingredients.length ? (
            <ul className="mt-4 space-y-3">
              {ingredients.map((line, i) => {
                const id = `ing-${i}`;
                return (
                  <li key={id}>
                    <label
                      htmlFor={id}
                      className="group grid grid-cols-[auto_1fr] items-center gap-3 rounded-2xl bg-white/90 ring-1 ring-black/5 shadow-sm px-4 py-3 cursor-pointer focus-within:ring-2 focus-within:ring-orange-400"
                    >
                      {/* Native checkbox for a11y; styled via peer */}
                      <input
                        id={id}
                        type="checkbox"
                        className="peer sr-only"
                        aria-label={`Mark ${line} as ready`}
                      />

                      {/* Unchecked icon */}
                      <span className="inline-flex h-6 w-6 items-center justify-center text-gray-400 peer-checked:hidden">
                        <Circle className="h-5 w-5" aria-hidden />
                      </span>
                      {/* Checked icon */}
                      <span className="hidden h-6 w-6 items-center justify-center text-emerald-600 peer-checked:inline-flex">
                        <CheckCircle2 className="h-5 w-5" aria-hidden />
                      </span>

                      {/* Text */}
                      <span className="text-[15px] text-orange-900/90 peer-checked:text-gray-400 peer-checked:line-through">
                        {line}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-orange-900/80">
              No ingredients found for this recipe yet.
            </p>
          )}
        </div>
      </section>

      {/* Bottom nav (wire it up later) */}
      <nav className="fixed inset-x-0 bottom-0 z-30">
        <div className="mx-auto max-w-screen-sm w-full px-4 pb-4">
          <div className="rounded-full p-3 bg-white/14 backdrop-blur ring-1 ring-white/35 shadow-[0_8px_30px_rgba(0,0,0,0.12)] grid grid-cols-2 gap-4">
            <button
              className="h-14 rounded-full bg-white/70 text-orange-900 text-lg font-semibold ring-1 ring-orange-700/40 shadow flex items-center justify-center gap-2 cursor-not-allowed"
              aria-disabled="true"
              disabled
            >
              <ChevronLeft className="size-5" /> Prev
            </button>
            <button
              className="h-14 rounded-full bg-orange-600 text-white text-lg font-semibold ring-1 ring-orange-700/40 shadow flex items-center justify-center gap-2 hover:bg-orange-700 active:bg-orange-800 active:translate-y-px transition"
            >
              Next <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </nav>
    </main>
  );
}
