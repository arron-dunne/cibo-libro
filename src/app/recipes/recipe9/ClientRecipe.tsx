"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Clock, Flame, Users, Share2, Bookmark, CheckCircle2, Circle } from "lucide-react";
import type { Recipe, Step } from "./page";

export default function ClientRecipe({ recipe }: { recipe: Recipe }) {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500 text-slate-900">
      {/* Floating Navbar */}
      <nav className="sticky top-4 z-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-3 rounded-full border border-white/30 bg-white/70 px-4 py-2 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-orange-600 text-white shadow">🍊</div>
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

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:pt-10">
        {/* HERO CARD */}
        <section className="overflow-hidden rounded-3xl border border-white/40 bg-white shadow-2xl">
          <div className="grid items-stretch gap-0 md:grid-cols-[1.2fr_1fr]">
            {/* Image pane */}
            <div className="relative">
              <div className="relative h-72 w-full md:h-full">
                <Image
                  src={recipe.imageUrl || "https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e"}
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

              <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">{recipe.title}</h1>

              {/* Tags (soft playful pills) */}
              <div className="mt-3 flex flex-wrap gap-2">
                {recipe.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800 shadow"
                  >
                    {emojiFor(t)} <span>{t}</span>
                  </span>
                ))}
              </div>

              <p className="mt-4 max-w-prose text-sm text-slate-600">{recipe.description}</p>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href="#steps"
                  className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700"
                >
                  Start cooking
                </a>
                <ShareButton title={recipe.title} url="/recipes/page">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </ShareButton>
                <button className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50">
                  <Bookmark className="h-4 w-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FLOATING ROW: AT-A-GLANCE (mini card) */}
        <section className="-mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Prep" value={`${recipe.prepMinutes}m`} icon={<Clock className="h-4 w-4" />} />
          <Stat label="Cook" value={`${recipe.cookMinutes}m`} icon={<Flame className="h-4 w-4" />} />
          <Stat label="Total" value={`${recipe.totalMinutes}m`} icon={<Clock className="h-4 w-4" />} />
          <Stat label="Serves" value={String(recipe.servings)} icon={<Users className="h-4 w-4" />} />
        </section>

        {/* CONTENT CARDS */}
        <section className="mt-6 grid items-start gap-6 md:grid-cols-[1fr_1fr]">
          {/* INGREDIENTS */}
          <Card title="Ingredients">
            <IngredientsList items={recipe.ingredients} />
          </Card>

          {/* STEPS (Timeline) */}
          <Card id="steps" title="Steps">
            <StepsTimeline steps={recipe.steps} />
          </Card>

          {/* SOURCE / COMPLIANCE */}
          <Card title="Source & Compliance">
            <div className="space-y-3 text-sm">
              {recipe.sourceUrl ? (
                <p>
                  Source:{" "}
                  <a
                    className="underline decoration-dotted underline-offset-2"
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View original recipe
                  </a>
                </p>
              ) : (
                <p>This is a user-authored recipe.</p>
              )}
              <p className="text-slate-500">
                We respect creators. Imported recipes stay private or link-only. Public pages are for user-authored
                recipes.{" "}
                <Link href="/legal/content-policy" className="underline underline-offset-2">
                  Learn more
                </Link>
                .
              </p>
              <div>
                <Link href={`/report?recipe=${recipe.id}`} className="text-sm font-medium underline underline-offset-2">
                  Report this recipe
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </main>

      {/* Sticky Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50">
        <div className="mx-auto max-w-6xl px-4 pb-4">
          <div className="rounded-2xl border border-white/40 bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm">
                <span className="font-semibold">Spaghetti al Pomodoro</span>{" "}
                <span className="text-slate-500">— ready in {recipe.totalMinutes} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="#steps"
                  className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700"
                >
                  Cook Mode
                </a>
                <ShareButton title={recipe.title} url="/recipes/page">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </ShareButton>
              </div>
            </div>
          </div>
        </div>
      </div>
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
        <h2 className="text-lg font-extrabold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-white/50 bg-white/90 px-4 py-3 text-sm shadow-lg backdrop-blur">
      <span className="text-orange-600">{icon}</span>
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function IngredientsList({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

function StepsTimeline({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative ml-3 space-y-6 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded before:bg-gradient-to-b before:from-orange-200 before:to-rose-200">
      {steps.map((s, i) => (
        <li key={i} className="relative pl-6">
          <div className="absolute left-[-9px] top-1 grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-[11px] font-extrabold text-white shadow">
            {i + 1}
          </div>
          <p className="text-base leading-relaxed">{s.text}</p>
          {s.timerSec ? <InlineTimer seconds={s.timerSec} /> : null}
        </li>
      ))}
    </ol>
  );
}

function InlineTimer({ seconds = 0 }: { seconds?: number }) {
  const [left, setLeft] = useState(seconds);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!run || left <= 0) return;
    const id = setInterval(() => setLeft((x) => x - 1), 1000);
    return () => clearInterval(id);
  }, [run, left]);

  useEffect(() => {
    if (left === 0 && run) setRun(false);
  }, [left, run]);

  if (seconds === 0) return null;
  const m = Math.floor(left / 60);
  const s = left % 60;

  return (
    <button
      onClick={() => setRun((r) => !r)}
      className="mt-2 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-orange-700"
    >
      {run ? "Pause" : "Start"} {m > 0 ? `${m}m ${s}s` : `${s}s`}
    </button>
  );
}

function ShareButton({
  title,
  url,
  children,
}: {
  title: string;
  url: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className="inline-flex items-center gap-2">
      <button
        className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 shadow hover:bg-orange-50"
        onClick={async () => {
          const absolute =
            typeof window !== "undefined" ? new URL(url, window.location.origin).toString() : url;
          if (navigator.share) {
            try {
              await navigator.share({ title, url: absolute });
              return;
            } catch {
              /* cancelled */
            }
          }
          try {
            await navigator.clipboard.writeText(absolute);
            setCopied(true);
          } catch {
            /* ignore */
          }
        }}
      >
        {children}
      </button>
      {copied && <span className="text-xs text-white/90">Copied!</span>}
    </div>
  );
}

function emojiFor(tag: string) {
  const t = tag.toLowerCase();
  if (t.includes("pasta")) return "🍝";
  if (t.includes("italian")) return "🇮🇹";
  if (t.includes("quick")) return "⚡";
  if (t.includes("comfort")) return "🥣";
  return "🏷️";
}
