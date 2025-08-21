// src/app/view/[slug]/page.tsx
'use server';

import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

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
      description: true,
      tags: true,
      prepMins: true,
      cookMins: true,
      servings: true,
      ingredients: true,
      steps: true,
      // imageKey intentionally ignored for now
      // imageUrl could exist in legacy data, but we'll use a fixed Unsplash fallback
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

  const fallbackImage =
    "https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e?q=80&w=1471&auto=format&fit=crop";

  return (
    <div className="space-y-6">
      {/* HERO CARD */}
      <section className="overflow-hidden rounded-3xl border border-white/40 bg-white shadow-2xl">
        <div className="grid items-stretch gap-0 md:grid-cols-[1.2fr_1fr]">
          {/* Image */}
          <div className="relative">
            <div className="relative h-72 w-full md:h-full">
              <Image
                src={fallbackImage}
                alt={recipe.title || "Recipe image"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0" />
            </div>
          </div>

          {/* Title + meta */}
          <div className="relative p-5 md:p-8">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-orange-200/50 blur-3xl" />
            <div className="absolute bottom-6 right-10 h-28 w-28 rounded-full bg-rose-200/60 blur-2xl" />

            <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
              {recipe.title || "Untitled recipe"}
            </h1>

            {!!tags.length && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800 shadow"
                  >
                    {emojiFor(t)} <span>{t}</span>
                  </span>
                ))}
              </div>
            )}

            {recipe.description && (
              <p className="mt-4 max-w-prose text-sm text-slate-600">
                {recipe.description}
              </p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatChip label="Prep" value={`${prep}m`} />
              <StatChip label="Cook" value={`${cook}m`} />
              <StatChip label="Total" value={`${total}m`} />
              <StatChip label="Serves" value={String(recipe.servings ?? 1)} />
            </div>
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

          <Card title="Notes">
            <p className="text-sm text-slate-600">No notes yet.</p>
          </Card>

          <Card title="Serve with">
            <p className="text-sm text-slate-600">Add sides or pairings.</p>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="grid gap-6">
          <Card id="steps" title="Steps">
            {steps.length ? (
              <ol className="relative ml-3 space-y-6 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded before:bg-gradient-to-b before:from-orange-200 before:to-rose-200">
                {steps.map((s, i) => (
                  <li key={i} className="relative pl-6">
                    <div className="absolute left-[-9px] top-1 grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-[11px] font-extrabold text-white shadow">
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

function emojiFor(tag: string) {
  const t = tag?.toLowerCase?.() ?? "";
  if (t.includes("pasta")) return "🍝";
  if (t.includes("italian")) return "🇮🇹";
  if (t.includes("quick")) return "⚡";
  if (t.includes("comfort")) return "🥣";
  return "🏷️";
}
