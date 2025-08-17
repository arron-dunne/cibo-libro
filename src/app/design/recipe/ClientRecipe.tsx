"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Clock,
  Flame,
  Users,
  Share2,
  Bookmark,
  Play,
  PencilLine,
  CheckCircle2,
  Circle,
  UtensilsCrossed,
  ExternalLink,
} from "lucide-react";

// Accept your existing JSON shape (steps are {text}, serveWith can be strings or {label, href})
type ServeWithItem = string | { label: string; href?: string };
type Step = { text: string };
type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  servings: number;
  ingredients: string[];
  steps: Step[] | string[];
  notes?: string;
  serveWith?: ServeWithItem[];
  sourceUrl?: string | null;
};

export default function ClientRecipe({ recipe }: { recipe: Recipe }) {
  // Gentle guard rails so UI never crashes if JSON is partial
  const stepsArray = Array.isArray(recipe.steps) ? recipe.steps : [];
  const normalizedSteps: Step[] = stepsArray.map((s: any) =>
    typeof s === "string" ? { text: s } : { text: s?.text ?? "" }
  );
  const serveWith: { label: string; href?: string }[] = Array.isArray(recipe.serveWith)
    ? recipe.serveWith.map((it: ServeWithItem) =>
        typeof it === "string" ? { label: it } : { label: it?.label ?? "", href: it?.href }
      )
    : [];

  return (
    <div className="min-h-dvh bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500 text-slate-900">
      {/* Floating Navbar */}
      <nav className="sticky top-4 z-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-3 rounded-full border border-white/30 bg-white/70 px-4 py-2 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-orange-600 text-white shadow">
              🍊
            </div>
            <span className="text-sm font-extrabold tracking-tight">Cookbook Hub</span>

            <div className="mx-2 hidden flex-1 items-center gap-2 rounded-full border border-orange-200/70 bg-white px-3 py-1.5 md:flex">
              <Search className="h-4 w-4 text-orange-600" />
              <input
                placeholder="Search your recipes…"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            <a href="#" className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold shadow hover:bg-white">
              Library
            </a>
            <a href="#" className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold shadow hover:bg-white">
              Add
            </a>
            <a href="#" className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold shadow hover:bg-white">
              Profile
            </a>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 pt-6 md:pt-10">
        {/* HERO CARD */}
        <section className="overflow-hidden rounded-3xl border border-white/40 bg-white shadow-2xl">
          <div className="grid items-stretch gap-0 md:grid-cols-[1.2fr_1fr]">
            {/* Image pane */}
            <div className="relative">
              <div className="relative h-72 w-full md:h-full">
                <Image
                  src={
                    recipe.imageUrl ||
                    "https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e?q=80&w=1471&auto=format&fit=crop"
                  }
                  alt={recipe.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />
              </div>
            </div>

            {/* Title & meta */}
            <div className="relative p-5 md:p-8">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-orange-200/50 blur-3xl" />
              <div className="absolute bottom-6 right-10 h-28 w-28 rounded-full bg-rose-200/60 blur-2xl" />

              <h1 className="font-fun text-3xl font-extrabold leading-tight md:text-5xl">
                {recipe.title}
              </h1>

              {/* Tags (soft playful pills) */}
              {!!recipe.tags?.length && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {recipe.tags!.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800 shadow"
                    >
                      {emojiFor(t)} <span>{t}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {recipe.description && (
                <p className="mt-4 max-w-prose text-sm text-slate-600">{recipe.description}</p>
              )}

              {/* At-a-glance INSIDE hero */}
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <StatChip icon={<Clock className="h-4 w-4" />} label="Prep" value={`${recipe.prepMinutes}m`} />
                <StatChip icon={<Flame className="h-4 w-4" />} label="Cook" value={`${recipe.cookMinutes}m`} />
                <StatChip icon={<Clock className="h-4 w-4" />} label="Total" value={`${recipe.totalMinutes}m`} />
                <StatChip icon={<Users className="h-4 w-4" />} label="Serves" value={String(recipe.servings)} />
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href="#steps"
                  className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700"
                >
                  <Play className="h-4 w-4" />
                  Start cooking
                </a>
                <ButtonGhost onClick={() => share("/recipes/page", recipe.title)}>
                  <Share2 className="h-4 w-4" />
                  Share
                </ButtonGhost>
                <ButtonGhost>
                  <Bookmark className="h-4 w-4" />
                  Save
                </ButtonGhost>
                <ButtonGhost>
                  <PencilLine className="h-4 w-4" />
                  Edit
                </ButtonGhost>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT: two-column flow (Ingredients/Notes/Serve With → Steps) */}
        <section className="mt-6 grid items-start gap-6 md:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT COLUMN */}
          <div className="grid gap-6">
            {/* INGREDIENTS (single column) */}
            <Card title="Ingredients">
              <IngredientsList items={recipe.ingredients || []} />
            </Card>

            {/* NOTES */}
            <Card title="Notes">
              <NotesArea defaultValue={recipe.notes || ""} />
            </Card>

            {/* SERVE WITH */}
            <Card title="Serve with">
              <ServeWith items={serveWith} />
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="grid gap-6">
            {/* STEPS (no timers here) */}
            <Card id="steps" title="Steps">
              <StepsTimeline steps={normalizedSteps} />
            </Card>
          </div>
        </section>
      </main>

      {/* SITE FOOTER ON BACKGROUND */}
      <footer className="mt-12 border-t border-white/30 bg-white/10 py-8 text-white backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-orange-600">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div className="font-fun text-lg font-extrabold">Cookbook Hub</div>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link className="hover:underline" href="/legal/content-policy">
              Content Policy
            </Link>
            <Link className="hover:underline" href="/legal/privacy">
              Privacy Policy
            </Link>
            <Link className="hover:underline" href="/support">
              Support
            </Link>
            <Link className="hover:underline" href="/contact">
              Contact
            </Link>
          </nav>
          <div className="text-xs/6 opacity-80">
            © {new Date().getFullYear()} Cookbook Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ============ Subcomponents ============ */

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
        <h2 className="font-fun text-lg font-extrabold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function StatChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-full border border-orange-200/70 bg-orange-50 px-3 py-1.5 text-xs font-semibold">
      <span className="text-orange-600">{icon}</span>
      <span className="text-slate-600">{label}</span>
      <span className="text-slate-900">{value}</span>
    </div>
  );
}

function ButtonGhost({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 shadow hover:bg-orange-50"
    >
      {children}
    </button>
  );
}

function IngredientsList({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  return (
    <ul className="space-y-3">
      {items.map((it, idx) => {
        const id = `ing-${idx}`;
        const on = !!checked[id];
        return (
          <li key={id}>
            <button
              aria-pressed={on}
              onClick={() => setChecked((m) => ({ ...m, [id]: !m[id] }))}
              className={
                "group flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition " +
                (on
                  ? "border-orange-500 bg-orange-50"
                  : "border-orange-200/70 bg-white hover:border-orange-400/70")
              }
            >
              <span className={on ? "text-orange-600" : "text-slate-400"}>
                {on ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </span>
              <span className={on ? "line-through opacity-70" : ""}>{it}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function NotesArea({ defaultValue }: { defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="space-y-2">
      <textarea
        className="min-h-[120px] w-full resize-vertical rounded-2xl border border-orange-200/70 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-orange-400"
        placeholder="Add your cooking notes…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50">
          <Bookmark className="h-4 w-4" />
          Save notes
        </button>
      </div>
    </div>
  );
}

function ServeWith({ items }: { items: { label: string; href?: string }[] }) {
  if (!items || items.length === 0)
    return <p className="text-sm text-slate-600">Add sides or pairings.</p>;

  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {items.map((it, idx) => (
        <li key={`${it.label}-${idx}`}>
          {it.href ? (
            <a
              href={it.href}
              className="group flex items-center justify-between rounded-xl border border-orange-200/70 bg-white px-3 py-2 text-sm font-semibold hover:border-orange-400/70"
            >
              <span>{it.label}</span>
              <ExternalLink className="h-4 w-4 text-orange-600 opacity-0 transition group-hover:opacity-100" />
            </a>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-orange-200/70 bg-white px-3 py-2 text-sm">
              <span>{it.label}</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function StepsTimeline({ steps }: { steps: Step[] }) {
  if (!steps || steps.length === 0) return <p className="text-sm text-slate-600">No steps yet.</p>;
  return (
    <ol className="relative ml-3 space-y-6 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded before:bg-gradient-to-b before:from-orange-200 before:to-rose-200">
      {steps.map((s, i) => (
        <li key={i} className="relative pl-6">
          <div className="absolute left-[-9px] top-1 grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-[11px] font-extrabold text-white shadow">
            {i + 1}
          </div>
          <p className="text-base leading-relaxed">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

async function share(url: string, title: string) {
  const absolute =
    typeof window !== "undefined" ? new URL(url, window.location.origin).toString() : url;
  if (navigator.share) {
    try {
      await navigator.share({ title, url: absolute });
      return;
    } catch {}
  }
  try {
    await navigator.clipboard.writeText(absolute);
  } catch {}
}

function emojiFor(tag: string) {
  const t = tag?.toLowerCase?.() ?? "";
  if (t.includes("pasta")) return "🍝";
  if (t.includes("italian")) return "🇮🇹";
  if (t.includes("quick")) return "⚡";
  if (t.includes("comfort")) return "🥣";
  return "🏷️";
}
