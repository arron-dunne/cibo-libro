'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookOpen, Star, Bookmark, Settings } from 'lucide-react';
import type { Recipe, Step } from './page';

export default function ClientRecipe({ recipe }: { recipe: Recipe }) {
  return (
    <div className="font-editorial bg-[oklch(98%_0.01_95)] text-[oklch(20%_0.02_20)]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        {/* Left Rail */}
        <aside className="sticky top-4 h-max rounded-2xl border border-[oklch(88%_0.02_20)] bg-[oklch(99%_0.005_95)] p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[oklch(55%_0.14_30)] text-[oklch(98%_0.01_95)]">🍽️</div>
            <div>
              <div className="text-sm font-semibold">Cookbook Hub</div>
              <div className="text-xs text-[oklch(40%_0.02_20)]">Editorial</div>
            </div>
          </div>
          <nav className="mt-4 grid gap-1 text-sm">
            <NavItem icon={<BookOpen />} label="Library" />
            <NavItem icon={<Star />} label="Favorites" />
            <NavItem icon={<Bookmark />} label="Collections" />
            <NavItem icon={<Settings />} label="Settings" />
          </nav>
        </aside>

        {/* Main */}
        <main>
          {/* Headline */}
          <header className="border-b border-[oklch(90%_0.02_20)] pb-4">
            <h1 className="text-4xl font-bold tracking-tight">{recipe.title}</h1>
            <p className="mt-2 max-w-prose text-[oklch(35%_0.02_20)]">{recipe.description}</p>
          </header>

          {/* Hero */}
          <section className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="relative h-[380px] overflow-hidden rounded-2xl ring-2 ring-[oklch(55%_0.14_30)] ring-offset-2 ring-offset-[oklch(99%_0.005_95)]">
              <Image src={recipe.imageUrl} alt={recipe.title} fill priority className="object-cover" />
            </div>
            <div className="grid content-start gap-3">
              <MetaRow label="Prep" value={`${recipe.prepMinutes} min`} />
              <MetaRow label="Cook" value={`${recipe.cookMinutes} min`} />
              <MetaRow label="Total" value={`${recipe.totalMinutes} min`} />
              <MetaRow label="Serves" value={String(recipe.servings)} />
              <div className="mt-2 flex flex-wrap gap-2">
                {recipe.tags.map((t) => (
                  <span key={t} className="rounded-full border border-[oklch(88%_0.02_20)] bg-[oklch(99%_0.005_95)] px-3 py-1 text-xs font-semibold">{t}</span>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <ButtonPrimary>Cook Mode</ButtonPrimary>
                <ButtonGhost onClick={async () => share(`/recipes/recipe3`, recipe.title)}>Share</ButtonGhost>
                <ButtonGhost>Edit</ButtonGhost>
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
    </div>
  );
}

/* Components */
function NavItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-[oklch(96%_0.02_95)]">
      <span className="text-[oklch(55%_0.14_30)]">{icon}</span> {label}
    </button>
  );
}
function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[oklch(90%_0.02_20)] bg-[oklch(99%_0.005_95)] px-3 py-2">
      <span className="text-xs uppercase tracking-wide text-[oklch(40%_0.02_20)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
function ButtonPrimary({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-lg bg-[oklch(55%_0.14_30)] px-4 py-2 text-sm font-semibold text-[oklch(98%_0.01_95)] shadow hover:brightness-110">
      {children}
    </button>
  );
}
function ButtonGhost({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="rounded-lg border border-[oklch(88%_0.02_20)] bg-[oklch(99%_0.005_95)] px-4 py-2 text-sm font-semibold hover:bg-[oklch(96%_0.02_95)]">
      {children}
    </button>
  );
}
async function share(url: string, title: string) {
  const absolute = typeof window !== 'undefined' ? new URL(url, window.location.origin).toString() : url;
  if (navigator.share) { try { await navigator.share({ title, url: absolute }); return; } catch {} }
  try { await navigator.clipboard.writeText(absolute); } catch {}
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[oklch(90%_0.02_20)] bg-[oklch(99%_0.005_95)] p-4">
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
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
            <button aria-pressed={on} onClick={() => setChecked((m) => ({ ...m, [id]: !m[id] }))} className={'mt-0.5 grid h-5 w-5 place-items-center rounded border transition ' + (on ? 'border-[oklch(55%_0.14_30)] bg-[oklch(55%_0.14_30)] text-[oklch(98%_0.01_95)]' : 'border-[oklch(88%_0.02_20)] bg-[oklch(99%_0.005_95)] hover:border-[oklch(70%_0.05_20)]')}>
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
            <div className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[oklch(55%_0.14_30)] text-xs font-bold text-[oklch(98%_0.01_95)]">{i + 1}</div>
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
  return <button onClick={() => setRun((r) => !r)} className="ml-9 h-8 rounded bg-[oklch(55%_0.14_30)] px-3 text-xs font-semibold text-[oklch(98%_0.01_95)] hover:brightness-110">{run ? 'Pause' : 'Start'} {m > 0 ? `${m}m ${s}s` : `${s}s`}</button>;
}
