'use client';

import React, { useMemo, useState } from 'react';

type SectionKey = 'basics' | 'ingredients' | 'steps' | 'tags';

export default function Page() {
  const [open, setOpen] = useState<SectionKey | null>('basics');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>([]);
  const [autosaveTick, setAutosaveTick] = useState(0);

  // Fake autosave “tick”
  React.useEffect(() => {
    const id = setInterval(() => setAutosaveTick((n) => (n + 1) % 3), 1200);
    return () => clearInterval(id);
  }, []);

  const canSave = useMemo(() => {
    const hasIngredient = ingredients.some((i) => i.trim().length > 0);
    const hasStep = steps.some((s) => s.trim().length > 0);
    return title.trim().length > 0 && hasIngredient && hasStep;
  }, [title, ingredients, steps]);

  const sections: { key: SectionKey; label: string }[] = [
    { key: 'basics', label: 'Basics' },
    { key: 'ingredients', label: 'Ingredients' },
    { key: 'steps', label: 'Steps' },
    { key: 'tags', label: 'Tags & Photo' },
  ];

  const addRow = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter((rows) => [...rows, '']);

  const setRow =
    (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number) =>
    (value: string) =>
      setter((rows) => rows.map((r, i) => (i === idx ? value : r)));

  const removeRow =
    (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number) =>
    () =>
      setter((rows) => rows.filter((_, i) => i !== idx));

  return (
    <div className="min-h-[100svh] bg-gray-50 text-zinc-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="font-semibold flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-orange-500" aria-hidden />
          Add Recipe
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-zinc-500" aria-live="polite">
            {['Saving…', 'Saved', 'Saved'][autosaveTick]}
          </div>
          <button
            className="rounded-lg border border-black/10 bg-orange-500 px-3.5 py-2 font-semibold text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_1px_0_rgba(0,0,0,.1)] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canSave}
          >
            Save
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[240px_1fr] lg:items-start">
        {/* Sidebar (desktop) */}
        <nav className="sticky top-[60px] hidden self-start rounded-xl border border-gray-200 bg-white p-3 lg:block">
          <div className="mb-2 px-1 text-xs font-medium text-zinc-500">Sections</div>
          <ul className="m-0 list-none p-0">
            {sections.map((s, i) => (
              <li key={s.key}>
                <button
                  className={[
                    'w-full text-left cursor-pointer rounded-lg px-3 py-2 flex items-center gap-2',
                    open === s.key
                      ? 'bg-orange-50 border border-orange-200'
                      : 'hover:bg-gray-100',
                  ].join(' ')}
                  onClick={() => setOpen(s.key)}
                >
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-gray-100 text-xs">
                    {i + 1}
                  </span>
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main notebook */}
        <main className="mx-auto w-full max-w-[980px]">
          {/* Top pills (mobile/tablet) */}
          <div className="mb-2 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {sections.map((s) => (
              <button
                key={s.key}
                className={[
                  'whitespace-nowrap rounded-full border px-3 py-2 text-sm',
                  open === s.key ? 'bg-orange-50 border-orange-200' : 'border-dashed border-gray-200 bg-white',
                ].join(' ')}
                onClick={() => setOpen(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Notebook page */}
          <section className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="p-2">
              <div className="mb-2 flex gap-2">
                <div className="h-3 w-16 rounded-md border border-slate-300 bg-slate-100" />
                <div className="h-3 w-16 rounded-md border border-slate-300 bg-slate-100" />
              </div>
              <div className="mb-2">
                <input
                  className="w-full rounded-lg border border-dashed border-slate-300 px-3 py-2 text-lg font-semibold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/30"
                  placeholder="Recipe title (e.g., Classic Pancakes)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="h-px bg-[repeating-linear-gradient(to_right,#e8ecf2,#e8ecf2_8px,transparent_8px,transparent_16px)]" />
            </div>

            {/* BASICS */}
            <Section
              id="basics"
              label="Basics"
              open={open === 'basics'}
              onToggle={() => setOpen(open === 'basics' ? null : 'basics')}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <label className="text-sm text-zinc-500">Short Description</label>
                  <textarea
                    className="min-h-24 w-full resize-y rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/30"
                    placeholder="What makes this recipe special?"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm text-zinc-500">Cover Image</label>
                  <div className="relative grid h-36 place-items-center rounded-xl border-2 border-dashed border-slate-300 bg-[repeating-linear-gradient(white,white_12px,#fafafa_12px,#fafafa_24px)] text-zinc-500">
                    <span>Drop image here or click to upload</span>
                    <input className="absolute inset-0 cursor-pointer opacity-0" type="file" />
                  </div>
                </div>
              </div>
            </Section>

            {/* INGREDIENTS */}
            <Section
              id="ingredients"
              label="Ingredients"
              open={open === 'ingredients'}
              onToggle={() => setOpen(open === 'ingredients' ? null : 'ingredients')}
            >
              <ol className="m-0 list-decimal pl-5">
                {ingredients.map((val, idx) => (
                  <li key={idx} className="mb-2 grid grid-cols-[1fr_auto] gap-2">
                    <input
                      className="w-full rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/30"
                      placeholder="e.g., 2 cups all-purpose flour"
                      value={val}
                      onChange={(e) => setRow(setIngredients, idx)(e.target.value)}
                    />
                    <button
                      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 hover:bg-gray-50"
                      aria-label="Remove ingredient"
                      onClick={removeRow(setIngredients, idx)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ol>
              <button
                className="mt-1 rounded-xl border border-dashed border-gray-200 bg-white px-3 py-2 hover:border-gray-300 hover:bg-gray-50"
                onClick={() => addRow(setIngredients)}
              >
                + Add Ingredient
              </button>
            </Section>

            {/* STEPS */}
            <Section
              id="steps"
              label="Steps"
              open={open === 'steps'}
              onToggle={() => setOpen(open === 'steps' ? null : 'steps')}
            >
              <ol className="m-0 list-decimal pl-5">
                {steps.map((val, idx) => (
                  <li key={idx} className="mb-2 grid grid-cols-[1fr_auto] gap-2">
                    <textarea
                      className="min-h-20 w-full resize-y rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/30"
                      placeholder="e.g., Whisk flour, sugar, and salt in a bowl…"
                      value={val}
                      onChange={(e) => setRow(setSteps, idx)(e.target.value)}
                    />
                    <button
                      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 hover:bg-gray-50"
                      aria-label="Remove step"
                      onClick={removeRow(setSteps, idx)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ol>
              <button
                className="mt-1 rounded-xl border border-dashed border-gray-200 bg-white px-3 py-2 hover:border-gray-300 hover:bg-gray-50"
                onClick={() => addRow(setSteps)}
              >
                + Add Step
              </button>
            </Section>

            {/* TAGS & PHOTO */}
            <Section
              id="tags"
              label="Tags & Photo"
              open={open === 'tags'}
              onToggle={() => setOpen(open === 'tags' ? null : 'tags')}
            >
              <div className="flex flex-wrap gap-2">
                <TagEditor value={tags} onChange={setTags} />
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                Tip: Add tags like <kbd className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5">Dinner</kbd>,{' '}
                <kbd className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5">Vegan</kbd>, or{' '}
                <kbd className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5">15-minute</kbd> to organize later.
              </div>
            </Section>
          </section>
        </main>
      </div>

      {/* Sticky Save Bar */}
      <div className="sticky bottom-0 z-40 flex items-center justify-between gap-3 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="text-sm text-zinc-500">
          {canSave ? 'Ready to save' : 'Add at least 1 ingredient & 1 step'}
        </div>
        <button
          className="rounded-lg border border-black/10 bg-orange-500 px-3.5 py-2 font-semibold text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_1px_0_rgba(0,0,0,.1)] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}

/** Collapsible section block */
function Section(props: {
  id: string;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-l-4 border-transparent p-3 [&+&]:border-t [&+&]:border-dashed [&+&]:border-gray-200">
      <div
        className="flex cursor-pointer items-center justify-between gap-2 py-1.5"
        onClick={props.onToggle}
        role="button"
        aria-expanded={props.open}
        aria-controls={props.id}
      >
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-zinc-500">{props.open ? '▾' : '▸'}</span>
          {props.label}
        </div>
        <div className="text-zinc-500">{props.open ? 'Hide' : 'Show'}</div>
      </div>
      {props.open && <div id={props.id} className="mt-2">{props.children}</div>}
    </div>
  );
}

/** Minimal inline tag editor (wireframe) */
function TagEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const t = draft.trim();
    if (!t) return;
    if (!value.includes(t)) onChange([...value, t]);
    setDraft('');
  };

  const remove = (t: string) => onChange(value.filter((x) => x !== t));

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {value.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-gray-200 bg-white px-2.5 py-1.5 text-sm"
          >
            {t}
            <button
              className="text-zinc-500 hover:text-zinc-700"
              onClick={() => remove(t)}
              aria-label={`Remove ${t}`}
            >
              ✕
            </button>
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-gray-200 bg-white px-2.5 py-1.5">
          <input
            className="min-w-[6ch] border-0 bg-transparent outline-none"
            placeholder="Add tag"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') add();
              if (e.key === 'Backspace' && draft === '' && value.length) {
                remove(value[value.length - 1]);
              }
            }}
          />
          <button className="text-zinc-500 hover:text-zinc-700" onClick={add} aria-label="Add tag">
            ＋
          </button>
        </span>
      </div>
    </>
  );
}
