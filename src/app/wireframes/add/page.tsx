'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type SectionKey = 'details' | 'ingredients' | 'steps' | 'photos';

type Snapshot = {
  title: string;
  desc: string;
  prepMins: number | '';
  cookMins: number | '';
  servings: number | '';
  ingredients: string[];
  steps: string[];
  tags: string[];
};

export default function Page() {
  // Core state
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [prepMins, setPrepMins] = useState<number | ''>('');
  const [cookMins, setCookMins] = useState<number | ''>('');
  const [servings, setServings] = useState<number | ''>('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>([]);
  const [autosaveTick, setAutosaveTick] = useState(0);

  // UI state
  const [activeSection, setActiveSection] = useState<SectionKey>('details');
  const [draftSaved, setDraftSaved] = useState<null | string>(null);

  // Undo stack
  const [history, setHistory] = useState<Snapshot[]>([]);

  // Fake autosave “tick”
  useEffect(() => {
    const id = setInterval(() => setAutosaveTick((n) => (n + 1) % 3), 1200);
    return () => clearInterval(id);
  }, []);

  // Derived
  const canSave = useMemo(() => {
    const hasIngredient = ingredients.some((i) => i.trim().length > 0);
    const hasStep = steps.some((s) => s.trim().length > 0);
    return title.trim().length > 0 && hasIngredient && hasStep;
  }, [title, ingredients, steps]);

  const sections: { key: SectionKey; label: string }[] = [
    { key: 'details', label: 'Details' },
    { key: 'ingredients', label: 'Ingredients' },
    { key: 'steps', label: 'Steps' },
    { key: 'photos', label: 'Photos' },
  ];

  // ---- Snapshot / Undo helpers ----
  const getSnapshot = (): Snapshot => ({
    title,
    desc,
    prepMins,
    cookMins,
    servings,
    ingredients,
    steps,
    tags,
  });

  const applySnapshot = (s: Snapshot) => {
    setTitle(s.title);
    setDesc(s.desc);
    setPrepMins(s.prepMins);
    setCookMins(s.cookMins);
    setServings(s.servings);
    setIngredients(s.ingredients);
    setSteps(s.steps);
    setTags(s.tags);
  };

  const pushHistory = () => {
    setHistory((h) => {
      const next = [...h, getSnapshot()];
      if (next.length > 50) next.shift();
      return next;
    });
  };

  const undo = () => {
    setHistory((h) => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      applySnapshot(prev);
      return h.slice(0, -1);
    });
  };

  // Draft save (fake)
  const saveDraft = () => {
    setDraftSaved('Draft saved');
    setTimeout(() => setDraftSaved(null), 1500);
    // Hook real API here
    // await fetch('/api/recipes/draft', { method: 'POST', body: JSON.stringify(getSnapshot()) })
  };

  // ---- Scroll / Scrollspy ----
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const ingredientsRef = useRef<HTMLDivElement | null>(null);
  const stepsRef = useRef<HTMLDivElement | null>(null);
  const photosRef = useRef<HTMLDivElement | null>(null);

  const refMap: Record<SectionKey, React.RefObject<HTMLDivElement>> = {
    details: detailsRef,
    ingredients: ingredientsRef,
    steps: stepsRef,
    photos: photosRef,
  };

  const scrollTo = (id: SectionKey) => {
    const el = refMap[id].current;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Move focus to heading for a11y after a moment
    setTimeout(() => {
      const heading = el.querySelector('h2') as HTMLElement | null;
      heading?.focus?.();
    }, 360);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        const id = visible.target.getAttribute('id') as SectionKey | null;
        if (id) setActiveSection(id);
      },
      {
        root: null,
        // Trigger when the section title is ~25% from the top (accounts for sticky bars)
        rootMargin: '-100px 0px -70% 0px',
        threshold: [0, 0.25, 0.6, 1],
      }
    );

    const els = [detailsRef, ingredientsRef, stepsRef, photosRef]
      .map((r) => r.current)
      .filter(Boolean) as Element[];

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ---- Utility: reorder array ----
  function reorder<T>(arr: T[], from: number, to: number) {
    const next = arr.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  }

  // ---- Drag & Drop (ingredients + steps) ----
  const dragState = useRef<{ kind: 'ingredients' | 'steps'; from: number } | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const onDragStart = (kind: 'ingredients' | 'steps', index: number) => (e: React.DragEvent) => {
    dragState.current = { kind, from: index };
    e.dataTransfer.effectAllowed = 'move';
    // For Firefox
    e.dataTransfer.setData('text/plain', `${kind}:${index}`);
  };

  const onDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    setOverIdx(index);
    e.dataTransfer.dropEffect = 'move';
  };

  const onDragLeave = () => setOverIdx(null);

  const onDrop = (kind: 'ingredients' | 'steps', index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const drag = dragState.current;
    dragState.current = null;
    setOverIdx(null);
    if (!drag || drag.kind !== kind) return;

    if (kind === 'ingredients') {
      if (drag.from === index) return;
      pushHistory();
      setIngredients((prev) => reorder(prev, drag.from, index));
    } else {
      if (drag.from === index) return;
      pushHistory();
      setSteps((prev) => reorder(prev, drag.from, index));
    }
  };

  // ---- Row helpers (add/set/remove) with undo ----
  const addRow = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    pushHistory();
    setter((rows) => [...rows, '']);
  };

  const setRow =
    (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number) =>
    (value: string) => {
      pushHistory();
      setter((rows) => rows.map((r, i) => (i === idx ? value : r)));
    };

  const removeRow =
    (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number) =>
    () => {
      pushHistory();
      setter((rows) => rows.filter((_, i) => i !== idx));
    };

  // Keyboard niceties (Enter to add, Backspace in empty to remove)
  const onIngredientKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && idx === ingredients.length - 1) {
      e.preventDefault();
      addRow(setIngredients);
    }
    if (e.key === 'Backspace' && ingredients[idx] === '' && ingredients.length > 1) {
      e.preventDefault();
      removeRow(setIngredients, idx)();
    }
    // Smart paste multi-line
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      // handled via onPaste
    }
  };

  const onStepKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      addRow(setSteps);
    }
    if (e.key === 'Backspace' && steps[idx] === '' && steps.length > 1) {
      e.preventDefault();
      removeRow(setSteps, idx)();
    }
  };

  const onPasteMultiline =
    (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number) =>
    (e: React.ClipboardEvent) => {
      const text = e.clipboardData.getData('text');
      if (text.includes('\n')) {
        e.preventDefault();
        const lines = text
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean);
        if (!lines.length) return;
        pushHistory();
        setter((rows) => {
          const next = rows.slice();
          next[idx] = lines[0];
          if (lines.length > 1) {
            next.splice(idx + 1, 0, ...lines.slice(1));
          }
          return next;
        });
      }
    };

  return (
    <div className="min-h-[100svh] bg-gray-50 text-zinc-900 flex flex-col">
      {/* Sticky Header (no Save here) */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="font-semibold flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-orange-500" aria-hidden />
          Add Recipe
        </div>
        <div className="text-xs text-zinc-500" aria-live="polite">
          {['Saving…', 'Saved', 'Saved'][autosaveTick]}
        </div>
      </header>

      {/* Content grid with sticky navs */}
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[240px_1fr] lg:items-start">
        {/* Desktop sticky sidebar pills (scrollspy) */}
        <nav className="sticky top-[60px] hidden self-start rounded-xl border border-gray-200 bg-white p-3 lg:block">
          <div className="mb-2 px-1 text-xs font-medium text-zinc-500">Sections</div>
          <ul className="m-0 list-none p-0 space-y-1">
            {sections.map((s, i) => {
              const active = activeSection === s.key;
              return (
                <li key={s.key}>
                  <button
                    onClick={() => scrollTo(s.key)}
                    className={[
                      'w-full text-left cursor-pointer rounded-lg px-3 py-2 flex items-center gap-2 transition-colors',
                      active
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-zinc-900 hover:bg-gray-100 border border-transparent',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'inline-flex size-5 items-center justify-center rounded-full text-xs',
                        active ? 'bg-white/25 text-white' : 'bg-gray-100 text-zinc-700',
                      ].join(' ')}
                    >
                      {i + 1}
                    </span>
                    {s.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Main column */}
        <main className="mx-auto w-full max-w-[980px]">
          {/* Mobile sticky pills under navbar (scrollspy) */}
          <div className="sticky top-[56px] z-30 mb-2 flex gap-2 overflow-x-auto border-b border-gray-200 bg-white/95 px-1 pb-2 pt-2 backdrop-blur lg:hidden">
            {sections.map((s) => {
              const active = activeSection === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => scrollTo(s.key)}
                  className={[
                    'whitespace-nowrap rounded-full border px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'border-gray-200 bg-white text-zinc-900 hover:bg-gray-50',
                  ].join(' ')}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Notebook sheet */}
          <section className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
            {/* Notebook header visual */}
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

            {/* DETAILS */}
            <div
              id="details"
              ref={detailsRef}
              className="scroll-mt-28 border-l-4 border-transparent p-3"
              aria-labelledby="details-title"
            >
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <span className="text-zinc-500">▸</span>
                <h2 id="details-title" className="text-base font-semibold" tabIndex={-1}>
                  Details
                </h2>
              </div>

              {/* Description */}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-1.5 md:col-span-2">
                  <label className="text-sm text-zinc-500">Short Description</label>
                  <textarea
                    className="min-h-24 w-full resize-y rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/30"
                    placeholder="What makes this recipe special?"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>

                {/* Time & Servings */}
                <div className="grid gap-1.5">
                  <label className="text-sm text-zinc-500">Prep Time (mins)</label>
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    className="w-full rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/30"
                    placeholder="e.g., 15"
                    value={prepMins}
                    onChange={(e) => {
                      pushHistory();
                      setPrepMins(e.target.value === '' ? '' : Number(e.target.value));
                    }}
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm text-zinc-500">Cook Time (mins)</label>
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    className="w-full rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/30"
                    placeholder="e.g., 20"
                    value={cookMins}
                    onChange={(e) => {
                      pushHistory();
                      setCookMins(e.target.value === '' ? '' : Number(e.target.value));
                    }}
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm text-zinc-500">Servings</label>
                  <input
                    type="number"
                    min={1}
                    inputMode="numeric"
                    className="w-full rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/30"
                    placeholder="e.g., 4"
                    value={servings}
                    onChange={(e) => {
                      pushHistory();
                      setServings(e.target.value === '' ? '' : Number(e.target.value));
                    }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="mt-3">
                <label className="mb-1 block text-sm text-zinc-500">Tags</label>
                <TagEditor
                  value={tags}
                  onChange={(val) => {
                    pushHistory();
                    setTags(val);
                  }}
                />
                <div className="mt-2 text-xs text-zinc-500">
                  Tip: Add tags like{' '}
                  <kbd className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5">Dinner</kbd>,{' '}
                  <kbd className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5">Vegan</kbd>, or{' '}
                  <kbd className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5">15-minute</kbd> to organize later.
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-3 h-px border-t border-dashed border-gray-200" />

            {/* INGREDIENTS */}
            <div
              id="ingredients"
              ref={ingredientsRef}
              className="scroll-mt-28 border-l-4 border-transparent p-3"
              aria-labelledby="ingredients-title"
            >
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <span className="text-zinc-500">▸</span>
                <h2 id="ingredients-title" className="text-base font-semibold" tabIndex={-1}>
                  Ingredients
                </h2>
              </div>
              <ol className="m-0 list-decimal pl-5">
                {ingredients.map((val, idx) => (
                  <li
                    key={idx}
                    className={[
                      'mb-2 grid grid-cols-[1fr_auto] gap-2 rounded-lg',
                      overIdx === idx ? 'outline outline-2 outline-orange-300' : '',
                    ].join(' ')}
                    draggable
                    onDragStart={onDragStart('ingredients', idx)}
                    onDragOver={onDragOver(idx)}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop('ingredients', idx)}
                  >
                    <input
                      className="w-full rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/30"
                      placeholder="e.g., 2 cups all-purpose flour"
                      value={val}
                      onChange={(e) => setRow(setIngredients, idx)(e.target.value)}
                      onKeyDown={onIngredientKeyDown(idx)}
                      onPaste={onPasteMultiline(setIngredients, idx)}
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
            </div>

            {/* Divider */}
            <div className="my-3 h-px border-t border-dashed border-gray-200" />

            {/* STEPS */}
            <div
              id="steps"
              ref={stepsRef}
              className="scroll-mt-28 border-l-4 border-transparent p-3"
              aria-labelledby="steps-title"
            >
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <span className="text-zinc-500">▸</span>
                <h2 id="steps-title" className="text-base font-semibold" tabIndex={-1}>
                  Steps
                </h2>
              </div>
              <ol className="m-0 list-decimal pl-5">
                {steps.map((val, idx) => (
                  <li
                    key={idx}
                    className={[
                      'mb-2 grid grid-cols-[1fr_auto] gap-2 rounded-lg',
                      overIdx === idx ? 'outline outline-2 outline-orange-300' : '',
                    ].join(' ')}
                    draggable
                    onDragStart={onDragStart('steps', idx)}
                    onDragOver={onDragOver(idx)}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop('steps', idx)}
                  >
                    <textarea
                      className="min-h-20 w-full resize-y rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/30"
                      placeholder="e.g., Whisk flour, sugar, and salt in a bowl…"
                      value={val}
                      onChange={(e) => setRow(setSteps, idx)(e.target.value)}
                      onKeyDown={onStepKeyDown(idx)}
                      onPaste={onPasteMultiline(setSteps, idx)}
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
            </div>

            {/* Divider */}
            <div className="my-3 h-px border-t border-dashed border-gray-200" />

            {/* PHOTOS */}
            <div
              id="photos"
              ref={photosRef}
              className="scroll-mt-28 border-l-4 border-transparent p-3"
              aria-labelledby="photos-title"
            >
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <span className="text-zinc-500">▸</span>
                <h2 id="photos-title" className="text-base font-semibold" tabIndex={-1}>
                  Photos
                </h2>
              </div>

              {/* Cover image */}
              <div className="grid gap-1.5">
                <label className="text-sm text-zinc-500">Cover Image</label>
                <div className="relative grid h-36 place-items-center rounded-xl border-2 border-dashed border-slate-300 bg-[repeating-linear-gradient(white,white_12px,#fafafa_12px,#fafafa_24px)] text-zinc-500">
                  <span>Drop image here or click to upload</span>
                  <input className="absolute inset-0 cursor-pointer opacity-0" type="file" />
                </div>
              </div>

              {/* Optional gallery placeholder */}
              <div className="mt-3">
                <label className="mb-1 block text-sm text-zinc-500">Additional Photos (optional)</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="aspect-video rounded-lg border-2 border-dashed border-slate-300 bg-white/40"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Bottom spacer so sticky bar doesn't overlap last inputs */}
          <div className="h-24" />
        </main>
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-0 z-40 flex items-center justify-between gap-3 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={undo}
            disabled={!history.length}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
            title={history.length ? 'Undo last change' : 'Nothing to undo'}
          >
            ⟲ Undo
          </button>
          <button
            onClick={saveDraft}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            Save draft
          </button>
          {draftSaved && (
            <span className="text-xs text-emerald-600">{draftSaved}</span>
          )}
        </div>
        <button
          className="rounded-lg border border-black/10 bg-orange-500 px-3.5 py-2 font-semibold text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_1px_0_rgba(0,0,0,.1)] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canSave}
          onClick={() => {
            // Hook real save here
            // fetch('/api/recipes', { method: 'POST', body: JSON.stringify(getSnapshot()) })
            console.log('Save', getSnapshot());
          }}
        >
          Save
        </button>
      </div>
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
  );
}
