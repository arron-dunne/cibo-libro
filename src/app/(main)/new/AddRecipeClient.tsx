// app/recipes/new/AddRecipeClient.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { saveDraft, updateRecipe, publishRecipe, publishDraft } from "./actions";

// ────────────────────────────────────────────────────────────────────────────
// Types / utils
// ────────────────────────────────────────────────────────────────────────────
type SectionKey = "details" | "ingredients" | "steps" | "photos";

type Snapshot = {
  title: string;
  imageUrl?: string | null;
  ingredients: string[];
  steps: string[];
  tags: string[];
  sourceUrl?: string | null;
};

const clsx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");
const sanitizeLines = (xs: string[]) => xs.map((s) => s.trim()).filter(Boolean);

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────
export default function AddRecipeClient() {
  // Core state aligned with actions schema
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([]);
  const [sourceUrl] = useState<string | null>(null); // keep null for manual add

  // Draft / publish state
  const [draftId, setDraftId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [undo, setUndo] = useState<Snapshot | null>(null);

  // Section anchors
  const sectionsRef = {
    details: useRef<HTMLDivElement | null>(null),
    ingredients: useRef<HTMLDivElement | null>(null),
    steps: useRef<HTMLDivElement | null>(null),
    photos: useRef<HTMLDivElement | null>(null),
  };
  const [active, setActive] = useState<SectionKey>("details");

  const canPublish =
    title.trim().length > 0 &&
    sanitizeLines(ingredients).length > 0 &&
    sanitizeLines(steps).length > 0;

  // Snapshot helpers
  const snapshot = useCallback(
    (): Snapshot => ({
      title: title.trim(),
      imageUrl: imageUrl || null,
      ingredients: sanitizeLines(ingredients),
      steps: sanitizeLines(steps),
      tags: sanitizeLines(tags),
      sourceUrl: sourceUrl || null,
    }),
    [title, imageUrl, ingredients, steps, tags, sourceUrl]
  );

  const setSnapshot = (s: Snapshot) => {
    setTitle(s.title ?? "");
    setImageUrl(s.imageUrl ?? null);
    setIngredients(s.ingredients?.length ? s.ingredients : [""]);
    setSteps(s.steps?.length ? s.steps : [""]);
    setTags(s.tags ?? []);
  };

  const pushUndo = () => setUndo(snapshot());
  const doUndo = () => {
    if (undo) setSnapshot(undo);
    setUndo(null);
  };

  // Active section tracking (for pill highlight)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
        if (!visible) return;
        const id = visible.target.getAttribute("data-section") as SectionKey | null;
        if (id) setActive(id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.2, 0.5, 1] }
    );
    Object.values(sectionsRef).forEach((r) => r.current && observer.observe(r.current));
    return () => observer.disconnect();
  }, []);

  // Actions
  const onSaveDraft = async () => {
    setSaving(true);
    try {
      const data = snapshot();
      let id = draftId;
      if (!id) {
        const res = await saveDraft(data);
        id = res.id;
        setDraftId(id);
      } else {
        await updateRecipe(id, data);
      }
      setToast("Draft saved");
    } catch {
      setToast("Failed to save draft");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 1600);
    }
  };

  const onPublish = async () => {
    if (!canPublish) return;
    setPublishing(true);
    try {
      if (draftId) {
        const res = await publishDraft(draftId);
        window.location.href = `/recipes/${res.slug ?? res.id}`;
      } else {
        const res = await publishRecipe(snapshot());
        window.location.href = `/recipes/${res.slug ?? res.id}`;
      }
    } catch {
      setToast("Failed to publish");
      setPublishing(false);
      setTimeout(() => setToast(null), 1800);
    }
  };

  // List editing helpers
  const addRow = (setter: React.Dispatch<React.SetStateAction<string[]>>) => setter((xs) => [...xs, ""]);
  const removeRow = (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number) =>
    setter((xs) => (xs.length > 1 ? xs.filter((_, i) => i !== idx) : xs));
  const onPasteMulti =
    (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number) =>
    (e: React.ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const text = e.clipboardData.getData("text");
      if (text.includes("\n")) {
        e.preventDefault();
        const lines = sanitizeLines(text.split("\n"));
        setter((xs) => {
          const copy = [...xs];
          copy[idx] = (copy[idx] || "") + lines[0];
          if (lines.length > 1) copy.splice(idx + 1, 0, ...lines.slice(1));
          return copy;
        });
      }
    };

  const scrollTo = (key: SectionKey) => {
    const el = sectionsRef[key].current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    const heading = el.querySelector("h2") as HTMLElement | null;
    setTimeout(() => heading?.focus?.(), 350);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="text-zinc-900">
      {/* Mobile pills (top under navbar) */}
      <div className="sticky top-16 z-30 border-b border-white/40 bg-white/80 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex w-[min(1250px,95%)] gap-2 overflow-x-auto">
          {SECTIONS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => scrollTo(key)}
              className={clsx(
                "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition",
                active === key ? "bg-orange-500 text-white shadow" : "bg-white/90 text-zinc-700 hover:bg-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content wrapper – FLEX (rail fixed, form expands) */}
      <div className="mx-auto w-[min(1250px,95%)] px-4 md:px-6">
        <div className="md:flex md:items-start md:gap-6">
          {/* Side rail – desktop only */}
          <aside className="hidden md:block sticky top-24 w-56 shrink-0">
            <div className="rounded-2xl border border-white/60 bg-white/70 p-2 shadow-md backdrop-blur">
              {SECTIONS.map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => scrollTo(key)}
                  className={clsx(
                    "mb-2 w-full rounded-xl px-3 py-2 text-left text-sm font-medium last:mb-0",
                    active === key ? "bg-orange-500 text-white shadow" : "bg-white text-zinc-700 hover:bg-zinc-50"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </aside>

          {/* Form column – expands to fill remaining width */}
          <section className="mt-4 min-w-0 flex-1 md:mt-0">
            <div className="flex flex-col gap-5">
              {/* Basics */}
              <Panel ref={sectionsRef.details} id="details" title="Basics" subtitle="Title, optional cover, and tags.">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label>Title</Label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-zinc-300 bg-white/95 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="e.g. Grandma’s Best Lasagna"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label>Image URL (optional)</Label>
                    <input
                      type="url"
                      className="w-full rounded-lg border border-zinc-300 bg-white/95 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="https://example.com/cover.jpg"
                      value={imageUrl ?? ""}
                      onChange={(e) => setImageUrl(e.target.value || null)}
                    />
                    <p className="mt-1 text-xs text-zinc-500">
                      Hook your uploader later; this stores to <code>imageUrl</code>.
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <Label>Tags</Label>
                    <TagsEditor value={tags} onChange={setTags} />
                  </div>
                </div>
              </Panel>

              {/* Ingredients */}
              <Panel
                ref={sectionsRef.ingredients}
                id="ingredients"
                title="Ingredients"
                subtitle="One per line. Paste multi-line to auto-split."
              >
                <div className="flex flex-col gap-2">
                  {ingredients.map((val, i) => (
                    <Row
                      key={`ing-${i}`}
                      value={val}
                      placeholder={i === 0 ? "e.g. 250g dried pasta" : ""}
                      rows={1}
                      onChange={(v) => setIngredients((xs) => xs.map((x, idx) => (idx === i ? v : x)))}
                      onPaste={onPasteMulti(setIngredients, i)}
                      onAdd={() => addRow(setIngredients)}
                      onRemove={() => removeRow(setIngredients, i)}
                      disableRemove={ingredients.length === 1}
                    />
                  ))}
                </div>
              </Panel>

              {/* Steps */}
              <Panel ref={sectionsRef.steps} id="steps" title="Steps" subtitle="One step per line. Paste multi-line to auto-split.">
                <div className="flex flex-col gap-2">
                  {steps.map((val, i) => (
                    <Row
                      key={`step-${i}`}
                      value={val}
                      placeholder={i === 0 ? "e.g. Preheat oven to 180°C (fan)." : ""}
                      rows={2}
                      onChange={(v) => setSteps((xs) => xs.map((x, idx) => (idx === i ? v : x)))}
                      onPaste={onPasteMulti(setSteps, i)}
                      onAdd={() => addRow(setSteps)}
                      onRemove={() => removeRow(setSteps, i)}
                      disableRemove={steps.length === 1}
                    />
                  ))}
                </div>
              </Panel>

              {/* Photos */}
              <Panel
                ref={sectionsRef.photos}
                id="photos"
                title="Photos"
                subtitle='Hook your uploader here later. For now, use the Image URL in “Basics”.'
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {imageUrl ? (
                    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white/90">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl} alt="Cover" className="h-40 w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-zinc-300 text-zinc-400">
                      No image selected
                    </div>
                  )}
                </div>
              </Panel>

              {/* Bottom bar */}
              <div className="sticky bottom-0 z-40 mt-2 flex items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-md backdrop-blur">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50"
                    onClick={doUndo}
                    disabled={!undo}
                    title="Undo last change"
                  >
                    ⟲ Undo
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50"
                    onClick={() => {
                      pushUndo();
                      onSaveDraft();
                    }}
                    disabled={saving}
                  >
                    {saving ? "Saving…" : "Save draft"}
                  </button>
                  {toast && <span className="text-xs text-emerald-600">{toast}</span>}
                </div>

                <button
                  type="button"
                  className="rounded-lg border border-black/10 bg-orange-500 px-3.5 py-2 font-semibold text-white shadow disabled:opacity-50"
                  disabled={!canPublish || publishing}
                  onClick={onPublish}
                >
                  {publishing ? "Publishing…" : "Publish"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Small atoms
// ────────────────────────────────────────────────────────────────────────────
const SECTIONS: [SectionKey, string][] = [
  ["details", "Basics"],
  ["ingredients", "Ingredients"],
  ["steps", "Steps"],
  ["photos", "Photos"],
];

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="mb-1 block text-sm font-medium">{children}</label>
);

const Row = ({
  value,
  onChange,
  onPaste,
  onAdd,
  onRemove,
  disableRemove,
  placeholder,
  rows,
}: {
  value: string;
  onChange: (v: string) => void;
  onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onAdd: () => void;
  onRemove: () => void;
  disableRemove?: boolean;
  placeholder?: string;
  rows?: number;
}) => (
  <div className="flex items-start gap-2">
    <textarea
      rows={rows ?? 1}
      className="min-h-[40px] w-full resize-y rounded-lg border border-zinc-300 bg-white/95 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onPaste={onPaste}
    />
    <div className="flex gap-1">
      <button className="rounded-md border border-zinc-300 px-2 py-2 text-sm hover:bg-zinc-50" onClick={onAdd} type="button">
        +
      </button>
      <button
        className="rounded-md border border-zinc-300 px-2 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50"
        onClick={onRemove}
        disabled={disableRemove}
        type="button"
      >
        −
      </button>
    </div>
  </div>
);

function TagsEditor({ value, onChange }: { value: string[]; onChange: (xs: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (!value.includes(v)) onChange([...value, v]);
    setDraft("");
  };
  const remove = (t: string) => onChange(value.filter((x) => x !== t));
  return (
    <div className="rounded-xl border border-zinc-300 bg-white p-2">
      <div className="flex flex-wrap gap-2">
        {value.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs">
            #{t}
            <button type="button" className="text-zinc-500 hover:text-zinc-700" onClick={() => remove(t)} aria-label={`Remove ${t}`}>
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
            if (e.key === "Backspace" && draft === "" && value.length) remove(value[value.length - 1]);
          }}
          placeholder="Add a tag and press Enter"
          className="flex-1 rounded-lg border border-zinc-300 bg-white/95 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button type="button" className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50" onClick={add} aria-label="Add tag">
          ＋
        </button>
      </div>
    </div>
  );
}

// Floating panel wrapper
const Panel = React.forwardRef<
  HTMLDivElement,
  { id: string; title: string; subtitle?: string; children: React.ReactNode }
>(({ id, title, subtitle, children }, ref) => (
  <div
    ref={ref}
    data-section={id}
    className="w-full scroll-mt-28 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-md backdrop-blur md:p-6"
  >
    <h2 tabIndex={-1} className="text-xl font-semibold tracking-tight">
      {title}
    </h2>
    {subtitle && <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>}
    <div className="mt-4">{children}</div>
  </div>
));
Panel.displayName = "Panel";
