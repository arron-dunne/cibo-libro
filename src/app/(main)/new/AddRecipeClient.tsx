"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  saveDraft,
  updateRecipe,
  publishRecipe,
  publishDraft,
} from "./actions";

// ---- Types ----
type SectionKey = "details" | "ingredients" | "steps" | "photos";

type Snapshot = {
  title: string;
  imageUrl?: string | null;
  ingredients: string[];
  steps: string[];
  tags: string[];
  sourceUrl?: string | null; // set if importing; null/undefined for manual
};

// ---- Helpers ----
function clsx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function sanitizeLines(xs: string[]) {
  return xs.map((s) => s.trim()).filter((s) => s.length > 0);
}

export default function AddRecipeClient() {
  // Core state (aligns with actions.ts BaseSchema)
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([]);
  // If you are importing, populate sourceUrl in initial state:
  const [sourceUrl] = useState<string | null>(null);

  // Draft/publish state
  const [draftId, setDraftId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Simple undo (one level)
  const [undo, setUndo] = useState<Snapshot | null>(null);

  // Section tracking for pill highlight
  const sectionsRef = {
    details: useRef<HTMLDivElement | null>(null),
    ingredients: useRef<HTMLDivElement | null>(null),
    steps: useRef<HTMLDivElement | null>(null),
    photos: useRef<HTMLDivElement | null>(null),
  };
  const [active, setActive] = useState<SectionKey>("details");

  const canPublish = title.trim().length > 0 && sanitizeLines(ingredients).length > 0 && sanitizeLines(steps).length > 0;

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
    // sourceUrl is fixed for manual add; omit
  };

  const pushUndo = () => setUndo(snapshot());
  const doUndo = () => {
    if (undo) setSnapshot(undo);
    setUndo(null);
  };

  // IntersectionObserver for pill highlight
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
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
      setToast("Failed to publish");
      setPublishing(false);
      setTimeout(() => setToast(null), 1800);
    }
  };

  // ---- UI helpers for list editing ----
  const addRow = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter((xs) => [...xs, ""]);
  const removeRow = (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number) =>
    setter((xs) => (xs.length > 1 ? xs.filter((_, i) => i !== idx) : xs));

  const onPasteMulti = (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number) =>
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
    // Focus heading for a11y
    const heading = el.querySelector("h2") as HTMLElement | null;
    setTimeout(() => heading?.focus?.(), 350);
  };

  // ---- Render ----
  return (
    <div className="rounded-2xl bg-white text-zinc-900 shadow-xl ring-1 ring-black/5">
      {/* Sticky Pills (mobile: top under navbar; desktop: left rail) */}
      <div className="sticky top-16 z-30 border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur lg:top-24 lg:border-b-0 lg:px-0">
        <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto lg:max-w-none lg:px-6">
          {([
            ["details", "Basics"],
            ["ingredients", "Ingredients"],
            ["steps", "Steps"],
            ["photos", "Photos"],
          ] as [SectionKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => scrollTo(key)}
              className={clsx(
                "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition",
                active === key
                  ? "bg-orange-500 text-white shadow"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 p-4 lg:grid-cols-[240px,1fr] lg:gap-8 lg:p-6">
        {/* Desktop rail (keeps pills visible beside the form) */}
        <div className="sticky top-28 hidden h-fit flex-col gap-2 lg:flex">
          {([
            ["details", "Basics"],
            ["ingredients", "Ingredients"],
            ["steps", "Steps"],
            ["photos", "Photos"],
          ] as [SectionKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => scrollTo(key)}
              className={clsx(
                "w-full rounded-full px-3 py-2 text-left text-sm font-medium",
                active === key ? "bg-orange-500 text-white shadow" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:p-6">
          {/* Details */}
          <section ref={sectionsRef.details} data-section="details" className="scroll-mt-28">
            <h2 tabIndex={-1} className="text-xl font-semibold tracking-tight">
              Basics
            </h2>
            <p className="mt-1 text-sm text-zinc-600">Title, optional cover, and tags.</p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Title</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g. Grandma’s Best Lasagna"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Image URL (optional)</label>
                <input
                  type="url"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="https://example.com/cover.jpg"
                  value={imageUrl ?? ""}
                  onChange={(e) => setImageUrl(e.target.value || null)}
                />
                <p className="mt-1 text-xs text-zinc-500">Hook your uploader later; this stores to <code>imageUrl</code>.</p>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Tags</label>
                <TagsEditor value={tags} onChange={setTags} />
              </div>
            </div>
          </section>

          <hr className="my-6 border-zinc-200" />

          {/* Ingredients */}
          <section ref={sectionsRef.ingredients} data-section="ingredients" className="scroll-mt-28">
            <h2 tabIndex={-1} className="text-xl font-semibold tracking-tight">
              Ingredients
            </h2>
            <p className="mt-1 text-sm text-zinc-600">One per line. Paste multi-line to auto-split.</p>

            <div className="mt-4 flex flex-col gap-2">
              {ingredients.map((val, i) => (
                <div key={`ing-${i}`} className="flex items-start gap-2">
                  <textarea
                    rows={1}
                    className="min-h-[40px] w-full resize-y rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder={i === 0 ? "e.g. 250g dried pasta" : ""}
                    value={val}
                    onChange={(e) =>
                      setIngredients((xs) => {
                        const copy = [...xs];
                        copy[i] = e.target.value;
                        return copy;
                      })
                    }
                    onPaste={onPasteMulti(setIngredients, i)}
                  />
                  <div className="flex gap-1">
                    <button
                      className="rounded-md border border-zinc-300 px-2 py-2 text-sm hover:bg-zinc-50"
                      onClick={() => addRow(setIngredients)}
                      type="button"
                    >
                      +
                    </button>
                    <button
                      className="rounded-md border border-zinc-300 px-2 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50"
                      onClick={() => removeRow(setIngredients, i)}
                      disabled={ingredients.length === 1}
                      type="button"
                    >
                      −
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="my-6 border-zinc-200" />

          {/* Steps */}
          <section ref={sectionsRef.steps} data-section="steps" className="scroll-mt-28">
            <h2 tabIndex={-1} className="text-xl font-semibold tracking-tight">
              Steps
            </h2>
            <p className="mt-1 text-sm text-zinc-600">One step per line. Paste multi-line to auto-split.</p>

            <div className="mt-4 flex flex-col gap-2">
              {steps.map((val, i) => (
                <div key={`step-${i}`} className="flex items-start gap-2">
                  <textarea
                    rows={2}
                    className="min-h-[56px] w-full resize-y rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder={i === 0 ? "e.g. Preheat oven to 180°C (fan)." : ""}
                    value={val}
                    onChange={(e) =>
                      setSteps((xs) => {
                        const copy = [...xs];
                        copy[i] = e.target.value;
                        return copy;
                      })
                    }
                    onPaste={onPasteMulti(setSteps, i)}
                  />
                  <div className="flex gap-1">
                    <button
                      className="rounded-md border border-zinc-300 px-2 py-2 text-sm hover:bg-zinc-50"
                      onClick={() => addRow(setSteps)}
                      type="button"
                    >
                      +
                    </button>
                    <button
                      className="rounded-md border border-zinc-300 px-2 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50"
                      onClick={() => removeRow(setSteps, i)}
                      disabled={steps.length === 1}
                      type="button"
                    >
                      −
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="my-6 border-zinc-200" />

          {/* Photos (placeholder for now) */}
          <section ref={sectionsRef.photos} data-section="photos" className="scroll-mt-28">
            <h2 tabIndex={-1} className="text-xl font-semibold tracking-tight">
              Photos
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Hook your uploader here later. For now, use the Image URL in “Basics”.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {imageUrl ? (
                <div className="overflow-hidden rounded-xl border border-zinc-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Cover" className="h-40 w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-zinc-300 text-zinc-400">
                  No image selected
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className="sticky bottom-0 z-40 flex items-center justify-between gap-3 rounded-b-2xl border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur">
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
            {saving ? "Saving…" : draftId ? "Save draft" : "Save draft"}
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
  );
}

/* --------------------------- Tags Editor --------------------------- */

function TagsEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (xs: string[]) => void;
}) {
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
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs"
          >
            #{t}
            <button
              type="button"
              className="text-zinc-500 hover:text-zinc-700"
              onClick={() => remove(t)}
              aria-label={`Remove ${t}`}
            >
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
            if (e.key === "Backspace" && draft === "" && value.length) {
              remove(value[value.length - 1]);
            }
          }}
          placeholder="Add a tag and press Enter"
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button
          type="button"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
          onClick={add}
          aria-label="Add tag"
        >
          ＋
        </button>
      </div>
    </div>
  );
}
