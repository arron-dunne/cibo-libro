'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Home, Search, Grid2X2, Plus, User, Clock, Armchair } from 'lucide-react';
import type { Recipe, Step } from './page';

export default function ClientRecipe({ recipe }: { recipe: Recipe }) {
  return (
    <div className="font-modern bg-slate-50 text-slate-900">
      {/* Top Nav (Modern) */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">🍝</div>
            <span className="text-base font-bold tracking-tight">Cookbook Hub</span>
          </div>
          <div className="mx-2 hidden flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 md:flex">
            <Search className="h-4 w-4 text-slate-500" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Search recipes…" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <NavBtn icon={<Home />} />
            <NavBtn icon={<Grid2X2 />} />
            <NavBtn icon={<Plus />} />
            <NavBtn icon={<User />} />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Hero */}
        <section className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative h-[360px] overflow-hidden rounded-2xl">
              <Image src={recipe.imageUrl} alt={recipe.title} fill priority className="object-cover" />
            </div>
            <div className="p-1">
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{recipe.title}</h1>
              <p className="mt-3 text-sm text-slate-600">{recipe.description}</p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                <Metric icon={<Clock className="h-4 w-4" />} label="Prep" value={`${recipe.prepMinutes}m`} />
                <Metric icon={<Clock className="h-4 w-4" />} label="Cook" value={`${recipe.cookMinutes}m`} />
                <Metric icon={<Clock className="h-4 w-4" />} label="Total" value={`${recipe.totalMinutes}m`} />
                <Metric icon={<Armchair className="h-4 w-4" />} label="Serves" value={String(recipe.servings)} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {recipe.tags.map((t) => (
                  <span key={t} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <PrimaryButton>Cook Mode</PrimaryButton>
                <OutlineButton onClick={async () => share(`/recipes/recipe2`, recipe.title)}>Share</OutlineButton>
                <OutlineButton>Edit</OutlineButton>
                {recipe.sourceUrl && (
                  <a className="text-sm font-semibold underline-offset-2 hover:underline" href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                    View original
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="mt-8 grid items-start gap-6 md:grid-cols-2">
          <Panel title="Ingredients">
            <IngredientsList items={recipe.ingredients} />
          </Panel>
          <Panel title="Steps">
            <StepsList steps={recipe.steps} />
          </Panel>
        </section>
      </main>
    </div>
  );
}

/* Components */
function NavBtn({ icon }: { icon: React.ReactNode }) {
  return <button className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50">{icon}</button>;
}
function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold">
      {icon} <span className="text-slate-500">{label}:</span> {value}
    </span>
  );
}
function PrimaryButton({ children }: { children: React.ReactNode }) {
  return <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700">{children}</button>;
}
function OutlineButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button onClick={onClick} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">{children}</button>;
}
async function share(url: string, title: string) {
  const absolute = typeof window !== 'undefined' ? new URL(url, window.location.origin).toString() : url;
  if (navigator.share) { try { await navigator.share({ title, url: absolute }); return; } catch {} }
  try { await navigator.clipboard.writeText(absolute); } catch {}
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
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
            <button aria-pressed={on} onClick={() => setChecked((m) => ({ ...m, [id]: !m[id] }))} className={'mt-0.5 grid h-5 w-5 place-items-center rounded border transition ' + (on ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white hover:border-slate-400')}>
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
            <div className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded bg-blue-600 text-xs font-bold text-white">{i + 1}</div>
            <p className="text-base leading-relaxed">{s.text}</p>
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
  return <button onClick={() => setRun((r) => !r)} className="ml-9 h-8 rounded bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700">{run ? 'Pause' : 'Start'} {m > 0 ? `${m}m ${s}s` : `${s}s`}</button>;
}
