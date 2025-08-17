'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Home, Search, Sparkles, ChefHat, Users } from 'lucide-react';
import type { Recipe, Step } from './page';

export default function ClientRecipe({ recipe }: { recipe: Recipe }) {
  return (
    <div className="font-modern bg-neutral-950 text-neutral-100">
      {/* Neon Nav */}
      <nav className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-emerald-400 text-neutral-950 shadow">🍜</div>
            <span className="text-lg font-semibold tracking-tight">Cookbook</span>
          </div>
          <div className="mx-2 hidden flex-1 items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 md:flex">
            <Search className="h-4 w-4 text-neutral-400" />
            <input className="w-full bg-transparent text-sm outline-none placeholder-neutral-500" placeholder="Search…" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <NeonBtn icon={<Home />} />
            <NeonBtn icon={<ChefHat />} />
            <NeonBtn icon={<Users />} />
            <NeonBtn icon={<Sparkles />} />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Hero */}
        <section className="rounded-3xl border border-neutral-800 bg-neutral-900 p-4 shadow-[0_0_40px_-20px_rgba(168,85,247,0.5)]">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative h-[360px] overflow-hidden rounded-2xl ring-1 ring-neutral-800">
              <Image src={recipe.imageUrl} alt={recipe.title} fill priority className="object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{recipe.title}</h1>
              <p className="mt-3 text-sm text-neutral-300">{recipe.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {recipe.tags.map((t) => (
                  <span key={t} className="rounded-full bg-neutral-800/60 px-3 py-1 text-xs font-semibold text-neutral-100 ring-1 ring-neutral-700">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Metric label="Prep" value={`${recipe.prepMinutes}m`} />
                <Metric label="Cook" value={`${recipe.cookMinutes}m`} />
                <Metric label="Total" value={`${recipe.totalMinutes}m`} />
                <Metric label="Serves" value={String(recipe.servings)} />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-neutral-900 shadow hover:brightness-110">Cook Mode</button>
                <button onClick={async () => share('/recipes/recipe4', recipe.title)} className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-neutral-850">Share</button>
                <button className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-neutral-850">Edit</button>
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="mt-8 grid items-start gap-6 md:grid-cols-2">
          <Panel title="Ingredients"><IngredientsList items={recipe.ingredients} /></Panel>
          <Panel title="Steps"><StepsList steps={recipe.steps} /></Panel>
        </section>
      </main>
    </div>
  );
}

/* Components */
function NeonBtn({ icon }: { icon: React.ReactNode }) {
  return <button className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-200 hover:text-emerald-400">{icon}</button>;
}
function Metric({ label, value }: { label: string; value: string }) {
  return <span className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-semibold text-emerald-300">{label}: <span className="text-neutral-100">{value}</span></span>;
}
async function share(url: string, title: string) {
  const absolute = typeof window !== 'undefined' ? new URL(url, window.location.origin).toString() : url;
  if (navigator.share) { try { await navigator.share({ title, url: absolute }); return; } catch {} }
  try { await navigator.clipboard.writeText(absolute); } catch {}
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <h2 className="mb-3 text-lg font-bold text-neutral-100">{title}</h2>
      {children}
    </div>
  );
}
function IngredientsList({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  return (
    <ul className="space-y-3">
      {items.map((it, idx) => {
        const id = `ing-${idx}`, on = !!checked[id];
        return (
          <li key={id} className="flex items-start gap-3">
            <button aria-pressed={on} onClick={() => setChecked((m) => ({ ...m, [id]: !m[id] }))} className={'mt-0.5 grid h-5 w-5 place-items-center rounded border transition ' + (on ? 'border-emerald-400 bg-emerald-400 text-neutral-900' : 'border-neutral-700 bg-neutral-900 hover:border-neutral-500')}>
              {on && <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3}><path d="M5 12l4 4L19 7" /></svg>}
            </button>
            <span className={on ? 'line-through opacity-70' : ''}>{it}</span>
          </li>
        );
      })}
    </ul>
  );
}
function StepsList({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-5">
      {steps.map((s, i) => (
        <li key={i} className="grid gap-2">
          <div className="flex items-start gap-3">
            <div className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded bg-fuchsia-500 text-xs font-bold text-neutral-950">{i + 1}</div>
            <p className="text-base leading-relaxed text-neutral-100">{s.text}</p>
          </div>
          <StepTimer seconds={s.timerSec ?? 0} />
        </li>
      ))}
    </ol>
  );
}
function StepTimer({ seconds = 0 }: { seconds?: number }) {
  const [left, setLeft] = useState(seconds), [run, setRun] = useState(false);
  useEffect(() => { if (!run || left <= 0) return; const id = setInterval(() => setLeft((x) => x - 1), 1000); return () => clearInterval(id); }, [run, left]);
  useEffect(() => { if (left === 0 && run) setRun(false); }, [left, run]);
  if (seconds === 0) return null;
  const m = Math.floor(left / 60), s = left % 60;
  return <button onClick={() => setRun((r) => !r)} className="ml-9 h-8 rounded bg-emerald-400 px-3 text-xs font-semibold text-neutral-900 hover:brightness-110">{run ? 'Pause' : 'Start'} {m > 0 ? `${m}m ${s}s` : `${s}s`}</button>;
}
