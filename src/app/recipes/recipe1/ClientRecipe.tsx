'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChefHat, Search, Home, BookOpen, Plus, User } from 'lucide-react';
import type { Recipe, Step } from './page';

export default function ClientRecipe({ recipe }: { recipe: Recipe }) {
  return (
    <div className="font-playful">
      {/* Top Nav (Playful) */}
      <nav className="sticky top-0 z-40 border-b border-amber-100 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50/70 backdrop-blur supports-[backdrop-filter]:bg-opacity-90">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-orange-500 text-white shadow">🍳</div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">Cookbook Hub</span>
          </div>
          <div className="mx-3 hidden flex-1 items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-2 md:flex">
            <Search className="h-4 w-4 text-orange-500" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Search your recipes…" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <IconButton icon={<Home />} label="Home" />
            <IconButton icon={<BookOpen />} label="Library" />
            <IconButton icon={<Plus />} label="Add" />
            <IconButton icon={<User />} label="Profile" />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
          <div className="grid items-stretch md:grid-cols-[1.1fr_1fr]">
            {/* Image */}
            <div className="relative">
              <div className="absolute inset-0 -z-0 bg-[radial-gradient(1000px_600px_at_-10%_-10%,rgba(255,200,150,0.35),transparent)]" />
              <div className="relative h-64 w-full overflow-hidden rounded-3xl md:h-full md:rounded-none md:rounded-l-3xl">
                <Image src={recipe.imageUrl} alt={recipe.title} fill priority className="object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-black/0 to-black/0" />
              </div>
            </div>

            {/* Title + meta */}
            <div className="relative p-5 md:p-8">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-100 blur-xl" />
              <div className="absolute bottom-6 right-8 h-20 w-20 rounded-full bg-rose-100 blur-xl" />

              <h1 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">{recipe.title}</h1>

              {/* Tags with emojis */}
              <div className="mt-3 flex flex-wrap gap-2">
                {recipe.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 shadow-[0_1px_0_rgba(0,0,0,0.03)]"
                  >
                    {emojiFor(t)} {t}
                  </span>
                ))}
              </div>

              <p className="mt-4 max-w-prose text-sm text-slate-600">{recipe.description}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <InfoChip label="Prep" value={`${recipe.prepMinutes} min`} icon="⏱️" />
                <InfoChip label="Cook" value={`${recipe.cookMinutes} min`} icon="🔥" />
                <InfoChip label="Total" value={`${recipe.totalMinutes} min`} icon="🕒" />
                <InfoChip label="Serves" value={String(recipe.servings)} icon="🍽️" />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <CookModeButton steps={recipe.steps} title={recipe.title} />
                <ShareButton title={recipe.title} url="/recipes/recipe1" />
                <a className="rounded-full border border-orange-300 bg-white px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50" href="#">
                  Edit recipe
                </a>
                {recipe.sourceUrl && (
                  <a className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 underline-offset-2 hover:underline" href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                    View original
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="mt-8 grid items-start gap-6 md:grid-cols-2">
          <Card title="Ingredients">
            <IngredientsList items={recipe.ingredients} />
          </Card>
          <Card title="Steps">
            <StepsList steps={recipe.steps} />
          </Card>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <Card title="Notes">
            <textarea className="min-h-[120px] w-full resize-vertical rounded-2xl border border-amber-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-orange-400" defaultValue={recipe.notes || ''} placeholder="Add your cooking notes…" />
          </Card>

          <Card title="Source & Compliance">
            <div className="space-y-3 text-sm">
              {recipe.sourceUrl ? (
                <p>
                  Source:{' '}
                  <a className="underline decoration-dotted underline-offset-2" href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                    View original recipe
                  </a>
                </p>
              ) : (
                <p>This is a user-authored recipe.</p>
              )}
              <p className="text-slate-500">
                We respect creators. Imported recipes stay private or link-only. Public pages are for user-authored recipes.{' '}
                <Link href="/legal/content-policy" className="underline underline-offset-2">Learn more</Link>.
              </p>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}

/* Components */
function IconButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button aria-label={label} title={label} className="grid h-9 w-9 place-items-center rounded-xl border border-orange-200 bg-white text-orange-600 hover:bg-orange-50">
      {icon}
    </button>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-amber-100 bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-2 border-b border-amber-100 px-5 py-4">
        <div className="h-2 w-2 rounded-full bg-amber-400" />
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}
function InfoChip({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800">
      <span aria-hidden>{icon}</span>
      <span className="uppercase tracking-wide text-[11px] text-orange-700">{label}</span>
      <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] text-slate-800">{value}</span>
    </span>
  );
}
function IngredientsList({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  return (
    <ul className="space-y-3">
      {items.map((it, idx) => {
        const id = `ing-${idx}`;
        const isOn = !!checked[id];
        return (
          <li key={id} className="flex items-start gap-3">
            <button aria-pressed={isOn} onClick={() => setChecked((m) => ({ ...m, [id]: !m[id] }))} className={'mt-0.5 grid h-5 w-5 place-items-center rounded border transition ' + (isOn ? 'border-orange-500 bg-orange-500 text-white' : 'border-amber-200 bg-white hover:border-orange-300')}>
              {isOn && <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3}><path d="M5 12l4 4L19 7" /></svg>}
            </button>
            <span className={isOn ? 'line-through opacity-70' : ''}>{it}</span>
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
            <div className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange-500 text-xs font-bold text-white shadow">{i + 1}</div>
            <p className="text-base leading-relaxed">{s.text}</p>
          </div>
          <StepTimer seconds={s.timerSec ?? 0} />
          {i < steps.length - 1 && <hr className="mt-2 border-amber-100" />}
        </li>
      ))}
    </ol>
  );
}
function StepTimer({ seconds = 0 }: { seconds?: number }) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  useEffect(() => { if (!running || left <= 0) return; const id = setInterval(() => setLeft((x) => x - 1), 1000); return () => clearInterval(id); }, [running, left]);
  useEffect(() => { if (left === 0 && running) setRunning(false); }, [left, running]);
  if (seconds === 0) return null;
  const m = Math.floor(left / 60), s = left % 60;
  return (
    <div className="pl-9">
      <button onClick={() => setRunning((r) => !r)} className="h-8 rounded-full bg-orange-500 px-3 text-xs font-semibold text-white shadow hover:bg-orange-600">
        {running ? 'Pause' : 'Start'} {m > 0 ? `${m}m ${s}s` : `${s}s`}
      </button>
      {left === 0 && <span className="ml-2 text-xs text-emerald-700">Done!</span>}
    </div>
  );
}
function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (!copied) return; const t = setTimeout(() => setCopied(false), 1500); return () => clearTimeout(t); }, [copied]);
  return (
    <div className="inline-flex items-center gap-2">
      <button className="rounded-full border border-orange-300 bg-white px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50" onClick={async () => {
        const absolute = typeof window !== 'undefined' ? new URL(url, window.location.origin).toString() : url;
        if (navigator.share) { try { await navigator.share({ title, url: absolute }); return; } catch {} }
        try { await navigator.clipboard.writeText(absolute); setCopied(true); } catch {}
      }}>
        Share
      </button>
      {copied && <span className="text-xs text-slate-500">Copied!</span>}
    </div>
  );
}
function emojiFor(tag: string) {
  const t = tag.toLowerCase();
  if (t.includes('pasta')) return '🍝';
  if (t.includes('italian')) return '🇮🇹';
  if (t.includes('quick')) return '⚡';
  if (t.includes('comfort')) return '🥣';
  return '🏷️';
}
function CookModeButton({ steps, title }: { steps: Step[]; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600" onClick={() => setOpen(true)}>Cook Mode</button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="absolute inset-x-0 bottom-0 border-t border-amber-100 bg-white md:inset-x-6 md:inset-y-6 md:rounded-3xl md:border" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="flex items-center justify-between border-b border-amber-100 px-4 py-3 md:px-6 md:py-4">
              <h2 className="text-lg font-bold md:text-2xl">{title}</h2>
              <button className="rounded-full border border-orange-300 bg-white px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50" onClick={() => setOpen(false)} autoFocus>Close</button>
            </div>
            <div className="p-4 md:p-6">
              <ol className="space-y-6">
                {steps.map((s, i) => (
                  <li key={i} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-orange-500 text-sm font-bold text-white shadow">{i + 1}</div>
                      <p className="text-xl leading-relaxed">{s.text}</p>
                    </div>
                    <StepTimer seconds={s.timerSec ?? 0} />
                    {i < steps.length - 1 && <hr className="opacity-50" />}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
