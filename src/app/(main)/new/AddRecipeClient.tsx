// app/new/AddRecipeClient.tsx
"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { saveDraft, updateRecipe, publishRecipe, publishDraft } from "./actions";

// ────────────────────────────────────────────────────────────────────────────
// Types / utils
// ────────────────────────────────────────────────────────────────────────────
type SectionKey = "details" | "ingredients" | "steps" | "photos";

type Snapshot = {
  // Keep aligned with your actions.ts/Zod & Prisma schema
  title: string;
  description?: string | null;
  prepMins?: number | null;
  cookMins?: number | null;
  servings?: number | null;
  imageKey?: string | null;
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
  // Core state (persisted via actions)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepMins, setPrepMins] = useState<number | null>(null);
  const [cookMins, setCookMins] = useState<number | null>(null);
  const [servings, setServings] = useState<number | null>(null);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([]);
  const [sourceUrl] = useState<string | null>(null); // manual adds keep this null

  // Draft / publish state
  const [draftId, setDraftId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [undo, setUndo] = useState<Snapshot | null>(null);

  // Section anchors (memoized so the object reference is stable for effects)
  const sectionsRef = useMemo(
    () => ({
      details: React.createRef<HTMLDivElement>(),
      ingredients: React.createRef<HTMLDivElement>(),
      steps: React.createRef<HTMLDivElement>(),
      photos: React.createRef<HTMLDivElement>(),
    }),
    []
  );
  const [active, setActive] = useState<SectionKey>("details");

  const canPublish =
    title.trim().length > 0 &&
    sanitizeLines(ingredients).length > 0 &&
    sanitizeLines(steps).length > 0;

  // Snapshot helpers (this is exactly what we send to your server actions)
  const snapshot = useCallback(
    (): Snapshot => ({
      title: title.trim(),
      description: description.trim() || null,
      prepMins,
      cookMins,
      servings,
      imageKey: imageKey || null,
      ingredients: sanitizeLines(ingredients),
      steps: sanitizeLines(steps),
      tags: sanitizeLines(tags),
      sourceUrl: sourceUrl || null,
    }),
    [title, description, prepMins, cookMins, servings, imageKey, ingredients, steps, tags, sourceUrl]
  );

  const setSnapshot = (s: Snapshot) => {
    setTitle(s.title ?? "");
    setDescription(s.description ?? "");
    setPrepMins(s.prepMins ?? null);
    setCookMins(s.cookMins ?? null);
    setServings(s.servings ?? null);
    setImageKey(s.imageKey ?? null);
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
  }, [sectionsRef]);

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
        window.location.href = `/view/${res.slug ?? res.id}`;
      } else {
        const res = await publishRecipe(snapshot());
        window.location.href = `/view/${res.slug ?? res.id}`;
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
      (e: React.ClipboardEvent<HTMLInputElement>) => {
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

  const handleEnter =
    (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number, selector: string) =>
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          setter((xs) => {
            const copy = [...xs];
            copy.splice(idx + 1, 0, "");
            return copy;
          });
          requestAnimationFrame(() => {
            const inputs = document.querySelectorAll<HTMLInputElement>(selector);
            inputs[idx + 1]?.focus();
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

  type SignResponse = {
    method: 'PUT';
    url: string;
    key: string;
    expiresIn: number;
    requiredHeaders: Record<string, string>;
    maxBytes: number;
  };

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // immediate preview from local file
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    setUploading(true);
    let attempt = 1;

    const tryUpload = async (): Promise<boolean> => {
      try {
        const signRes = await fetch('/api/images/sign-upload', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ contentType: file.type, size: file.size }),
        });
        if (!signRes.ok) throw new Error(`Sign failed: ${signRes.status}`);

        const { method, url, key, requiredHeaders, maxBytes } = (await signRes.json()) as SignResponse;
        if (file.size > maxBytes) throw new Error('File too large');

        const putRes = await fetch(url, { method, headers: requiredHeaders, body: file });
        if (!putRes.ok) {
          const txt = await putRes.text();
          throw new Error(`Upload failed: ${putRes.status} ${txt}`);
        }

        setImageKey(key);
        return true;
      } catch (err: any) {
        console.error(`Upload attempt ${attempt} failed`, err);
        return false;
      }
    };

    let success = await tryUpload();
    if (!success && attempt === 1) {
      attempt++;
      success = await tryUpload();
    }

    if (!success) {
      setUploadError("Could not upload image after retry.");
      // keep the local preview but indicate failure in UI
    }

    setUploading(false);
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
              {/* Details */}
              <Panel ref={sectionsRef.details} id="details" title="Details" subtitle="Title, description, times, servings, and tags.">
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
                    <Label>Description</Label>
                    <textarea
                      rows={3}
                      className="w-full rounded-lg border border-zinc-300 bg-white/95 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="Short note about the dish"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Prep time (min)</Label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className="w-full rounded-lg border border-zinc-300 bg-white/95 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                      value={prepMins ?? ""}
                      onChange={(e) => setPrepMins(e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                  <div>
                    <Label>Cook time (min)</Label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className="w-full rounded-lg border border-zinc-300 bg-white/95 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                      value={cookMins ?? ""}
                      onChange={(e) => setCookMins(e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                  <div>
                    <Label>Servings</Label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className="w-full rounded-lg border border-zinc-300 bg-white/95 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                      value={servings ?? ""}
                      onChange={(e) => setServings(e.target.value ? Number(e.target.value) : null)}
                    />
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
                subtitle="One per line. Press Enter to add another. Paste multi-line to auto-split."
              >
                <div className="flex flex-col gap-2">
                  {ingredients.map((val, i) => (
                    <div key={`ing-${i}`} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="ingredient-input w-full rounded-lg border border-zinc-300 bg-white/95 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder={i === 0 ? "e.g. 250g dried pasta" : ""}
                        value={val}
                        onChange={(e) => setIngredients((xs) => xs.map((x, idx) => (idx === i ? e.target.value : x)))}
                        onPaste={onPasteMulti(setIngredients, i)}
                        onKeyDown={handleEnter(setIngredients, i, "input.ingredient-input")}
                      />
                      <button
                        type="button"
                        className="rounded-md border border-zinc-300 px-2 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50"
                        onClick={() => removeRow(setIngredients, i)}
                        disabled={ingredients.length === 1}
                        aria-label="Remove ingredient"
                      >
                        −
                      </button>
                    </div>
                  ))}
                  <div>
                    <button
                      type="button"
                      className="mt-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
                      onClick={() => addRow(setIngredients)}
                    >
                      + Add ingredient
                    </button>
                  </div>
                </div>
              </Panel>

              {/* Steps */}
              <Panel
                ref={sectionsRef.steps}
                id="steps"
                title="Steps"
                subtitle="One per line. Press Enter to add another. Paste multi-line to auto-split."
              >
                <div className="flex flex-col gap-2">
                  {steps.map((val, i) => (
                    <div key={`step-${i}`} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="step-input w-full rounded-lg border border-zinc-300 bg-white/95 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder={i === 0 ? "e.g. Preheat oven to 180°C (fan)." : ""}
                        value={val}
                        onChange={(e) => setSteps((xs) => xs.map((x, idx) => (idx === i ? e.target.value : x)))}
                        onPaste={onPasteMulti(setSteps, i)}
                        onKeyDown={handleEnter(setSteps, i, "input.step-input")}
                      />
                      <button
                        type="button"
                        className="rounded-md border border-zinc-300 px-2 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50"
                        onClick={() => removeRow(setSteps, i)}
                        disabled={steps.length === 1}
                        aria-label="Remove step"
                      >
                        −
                      </button>
                    </div>
                  ))}
                  <div>
                    <button
                      type="button"
                      className="mt-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
                      onClick={() => addRow(setSteps)}
                    >
                      + Add step
                    </button>
                  </div>
                </div>
              </Panel>

              {/* Cover Image */}
              <Panel
                ref={sectionsRef.photos}
                id="cover-image"
                title="Cover Image"
                subtitle="JPEG, PNG, or WebP recommended."
              >
                <div className="sm:col-span-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onPick}
                    className="block w-full rounded-lg border border-zinc-300 bg-white/95 px-3 py-2"
                    disabled={uploading}
                  />

                  {/* Status messages */}
                  <div className="mt-2 text-sm">
                    {uploading && (
                      <span className="flex items-center gap-2 text-zinc-600">
                        <span className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></span>
                        Uploading…
                      </span>
                    )}
                    {!uploading && imageKey && !uploadError && (
                      <span className="text-emerald-600">Uploaded successfully</span>
                    )}
                    {uploadError && (
                      <span className="text-red-600">Upload failed: {uploadError}</span>
                    )}
                    {!uploading && !imageKey && !uploadError && (
                      <span className="text-zinc-600">No image selected</span>
                    )}
                  </div>

                  {/* Preview image */}
                  {imagePreview && (
                    <div className="mt-3 relative aspect-video w-full overflow-hidden rounded-lg border">
                      <Image
                        src={imagePreview}
                        alt="Cover image preview"
                        fill
                        sizes="100vw"
                        className={`object-cover ${uploadError ? "opacity-70 grayscale" : ""}`}
                      />
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
  ["details", "Details"],
  ["ingredients", "Ingredients"],
  ["steps", "Steps"],
  ["photos", "Photos"],
];

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="mb-1 block text-sm font-medium">{children}</label>
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
