"use client";

import Image from "next/image";
import { useState, useMemo, useRef, useCallback, useEffect, useActionState } from "react";
import { redirect } from "next/navigation";
import { compressImageFile } from "@/lib/images/compress";
import { MAX_SIZE_BYTES } from "@/lib/images/constants";
import { error } from "console";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

interface RecipeFormProps {
  mode: "new" | "edit";
  recipe?: Recipe; // optional existing recipe data
  action: (recipe: RecipeFormRecipe) => Promise<{succes: boolean, slug?: string, error?: string}> | void; // server action for handling submitted recipe
}

type SectionKey = "details" | "ingredients" | "steps" | "pictures";

// type Snapshot = {
//   title: string;
//   description?: string | null;
//   prepMins?: number | null;
//   cookMins?: number | null;
//   servings?: number | null;
//   ingredients: string[];
//   steps: string[];
//   tags: string[];
//   imageKey?: string | null;
// };

type SignUploadResponse = {
  method: "PUT";
  url: string;
  key: string;
  uploadId: string;
  expiresIn: number;
  requiredHeaders: Record<string, string>;
  maxBytes: number;
};

// ────────────────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────────────────
export default function RecipeForm({ mode, recipe, action }: RecipeFormProps) {

  const SECTIONS: [SectionKey, string][] = [
    ["details", "Details"],
    ["ingredients", "Ingredients"],
    ["steps", "Steps"],
    ["pictures", "Pictures"],
  ];

  // form states
  const [title, setTitle] = useState<string>(recipe?.title ?? "");
  const [description, setDescription] = useState<string>(recipe?.description ?? "");
  const [prepMins, setPrepMins] = useState<number | null>(recipe?.prepMins ?? null);
  const [cookMins, setCookMins] = useState<number | null>(recipe?.cookMins ?? null);
  const [servings, setServings] = useState<number | null>(recipe?.servings ?? null);
  const [ingredients, setIngredients] = useState<string[]>(recipe?.ingredients ?? []);
  const [steps, setSteps] = useState<string[]>(recipe?.steps ?? []);
  const [tags, setTags] = useState<string[]>(recipe?.tags ?? []);
  const [note, setNote] = useState<string>(recipe?.note ?? "");
  const [pending, setPending] = useState(false);

  // picture states
  const [imageKey, setImageKey] = useState<string | null>(null); // finalized pointer on recipe
  const [unattachedImage, setUnattachedImage] = useState<{ key: string; uploadId: string } | null>(null); // server-issued, not yet attached
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageNotice, setImageNotice] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Section anchors
  const sectionsRef = {
    details: useRef<HTMLDivElement>(null),
    ingredients: useRef<HTMLDivElement>(null),
    steps: useRef<HTMLDivElement>(null),
    pictures: useRef<HTMLDivElement>(null),
  };
  const [currentSection, setCurrentSection] = useState<SectionKey>("details");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    const result = await action({
      title,
      description,
      prepMins: prepMins ? Number(prepMins) : null,
      cookMins: cookMins ? Number(cookMins) : null,
      servings: servings ? Number(servings) : null,
      ingredients: sanitizeLines(ingredients),
      steps: sanitizeLines(steps),
      tags,
      note,
    });

    // should redirect in server action before this
    // setPending(false);

    if (result.success && result.slug) {
      // toast.success(mode === "new" ? "Recipe created!" : "Recipe updated!");
      redirect(`/view/${result.slug}`);
    } else {
      // toast.error(result.error || "Something went wrong");
      console.log(result.error)
    }
  };

  const scrollTo = (key: SectionKey) => {
    const el = sectionsRef[key].current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    const heading = el.querySelector("h2") as HTMLElement | null;
    setTimeout(() => heading?.focus?.(), 350);
  };

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

  // ──────────────────────────────────────────────────────────────────────────
  // Picture upload flow
  // ──────────────────────────────────────────────────────────────────────────

  // If an image exists, fetch it for the preview
  useEffect(() => {
    if (mode != 'edit' || !recipe?.imageKey) return;

    const fetchImage = async () => {
      try {
        const res = await fetch("/api/images/sign-download", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ key: recipe.imageKey }),
        });
        if (!res.ok) throw new Error("Failed to sign image URL");
        const { url } = (await res.json()) as { url: string };
        setImagePreview(url);
      } catch (err) {
        console.error("Error fetching signed image URL:", err);
        setImagePreview(null);
      }
    }
    fetchImage();

  }, [])

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setImageNotice(null);

    const raw = e.target.files?.[0];
    if (!raw) return;

    // 1) Instant preview swap (optimistic)
    const localUrl = URL.createObjectURL(raw);
    setImagePreview(localUrl);

    // 2) If there was a pending previous upload, remove it silently
    if (unattachedImage) {
      deleteUnattachedImageSilent(); // don't await; keep UI snappy
    }

    // 3) Begin upload (show only "Uploading…")
    setUploading(true);
    try {
      const compressed = await compressImageFile(raw, {
        maxWidth: 1600,
        maxHeight: 1600,
        maxBytes: MAX_SIZE_BYTES,
        preferWebP: true,
      });
      if (compressed.size > MAX_SIZE_BYTES) {
        throw new Error(`File too large (max ${Math.floor(MAX_SIZE_BYTES / (1024 * 1024))} MB)`);
      }

      const signRes = await fetch("/api/images/sign-upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contentType: compressed.type, size: compressed.size }),
      });
      if (!signRes.ok) throw new Error(`Sign failed: ${signRes.status}`);
      const { method, url, key, uploadId, requiredHeaders } = (await signRes.json()) as SignUploadResponse;

      const putOnce = async () => {
        const r = await fetch(url, { method, headers: requiredHeaders, body: compressed });
        if (!r.ok) throw new Error(`Upload failed: ${r.status}`);
      };
      try { await putOnce(); } catch { await putOnce(); }

      setImageKey(key);

      const fileName = (raw.name.replace(/\.\w+$/, "") || "image") + extFromMime(compressed.type);
      const compressedFile = new File([compressed], fileName, { type: compressed.type });
      setFileInput(compressedFile);

      setUploadError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  // Silent delete used only during "swap" (don't show Deleting…, don't clear preview/input)
  async function deleteUnattachedImageSilent() {
    if (!unattachedImage) return;
    const key = unattachedImage.key;

    // Clear just the draft key so UI no longer offers "Remove selected image"
    setUnattachedImage(null);

    // Fire-and-forget the server cleanup; no UI updates here
    fetch("/api/images/delete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key }),
    }).catch(() => { });
  }

  // helper: set the <input type="file"> to a given File (so it isn't left empty)
  function setFileInput(file: File) {
    try {
      const dt = new DataTransfer();
      dt.items.add(file);
      if (fileInputRef.current) fileInputRef.current.files = dt.files;
    } catch {
      // Not critical; some environments might block programmatic assignment
    }
  }

  function extFromMime(mime: string) {
    if (mime === "image/webp") return ".webp";
    if (mime === "image/png") return ".png";
    return ".jpg";
  }

  // async function deletePendingCover() {
  //   if (!coverDraft) return;
  //   // optimistic UI: hide immediately
  //   const prevPreview = imagePreview;
  //   const prevDraft = coverDraft;

  //   setDeleting(true);
  //   setImagePreview(null);
  //   setCoverDraft(null);
  //   setImageNotice("Deleting…");

  //   try {
  //     const res = await fetch("/api/images/delete", {
  //       method: "POST",
  //       headers: { "content-type": "application/json" },
  //       body: JSON.stringify({ key: prevDraft.key }),
  //     });
  //     if (!res.ok) throw new Error(String(res.status));

  //     // success
  //     if (fileInputRef.current) fileInputRef.current.value = "";
  //     setImageNotice("Image removed");
  //     setTimeout(() => setImageNotice(null), 1500);
  //   } catch {
  //     // revert on failure
  //     setCoverDraft(prevDraft);
  //     setImagePreview(prevPreview);
  //     setImageNotice("Failed to remove image");
  //     setTimeout(() => setImageNotice(null), 2000);
  //   } finally {
  //     setDeleting(false);
  //   }
  // }

  async function deleteUnattachedImage() {
    if (!unattachedImage) return;
    // optimistic UI: hide immediately
    const prevPreview = imagePreview;
    const prevUnattachedImage = unattachedImage;

    setDeleting(true);
    setImagePreview(null);
    setUnattachedImage(null);
    setImageNotice("Deleting…");

    try {
      const res = await fetch("/api/images/delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: prevUnattachedImage.key }),
      });
      if (!res.ok) throw new Error(String(res.status));

      // success
      if (fileInputRef.current) fileInputRef.current.value = "";
      setImageNotice("Image removed");
      setTimeout(() => setImageNotice(null), 1500);
    } catch {
      // revert on failure
      setUnattachedImage(prevUnattachedImage);
      setImagePreview(prevPreview);
      setImageNotice("Failed to remove image");
      setTimeout(() => setImageNotice(null), 2000);
    } finally {
      setDeleting(false);
    }
  }

  async function deleteAttachedImage() {
    if (!imageKey) return;
    // optimistic UI: hide immediately
    const prevPreview = imagePreview;
    const prevImageKey = imageKey;

    setDeleting(true);
    setImagePreview(null);
    setImageKey(null);
    setImageNotice("Deleting…");

    try {
      const res = await fetch("/api/images/delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: prevImageKey }),
      });
      if (!res.ok) throw new Error(String(res.status));

      if (fileInputRef.current) fileInputRef.current.value = "";
      setImageNotice("Image removed");
      setTimeout(() => setImageNotice(null), 1500);
    } catch {
      // revert on failure
      setImageKey(prevImageKey);
      setImagePreview(prevPreview);
      setImageNotice("Failed to remove image");
      setTimeout(() => setImageNotice(null), 2000);
    } finally {
      setDeleting(false);
    }
  }

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
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition
                ${currentSection === key ? "bg-orange-500 text-white shadow" : "bg-white/90 text-zinc-700 hover:bg-white"}`
              }
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
                  className={`mb-2 w-full rounded-xl px-3 py-2 text-left text-sm font-medium last:mb-0
                    ${currentSection === key ? "bg-orange-500 text-white shadow" : "bg-white text-zinc-700 hover:bg-zinc-50"}
                    `}
                >
                  {label}
                </button>
              ))}
            </div>
          </aside>

          {/* Form column – expands to fill remaining width */}
          <section className="mt-4 min-w-0 flex-1 md:mt-0">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
                ref={sectionsRef.pictures}
                id="cover-image"
                title="Cover Image"
                subtitle="Choose a photo (JPEG, PNG, WebP)"
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

                  {/* Upload status + inline delete (under the file input) */}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    {(uploading || deleting) && (
                      <span className="flex items-center gap-2 text-zinc-600">
                        <span className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></span>
                        {uploading ? "Uploading…" : "Deleting…"}
                      </span>
                    )}

                    {!uploading && !deleting && (unattachedImage || imageKey) && !uploadError && (
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-600">Uploaded successfully</span>
                        <button
                          type="button"
                          disabled={uploading || deleting}
                          onClick={async () => {
                            // This path is an explicit *delete*; shows "Deleting…"
                            try {
                              if (unattachedImage) await deleteUnattachedImage(); // the non-silent version
                              else if (imageKey && recipe) await deleteAttachedImage();
                            } catch { /* helpers set notices */ }
                          }}
                          className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {uploadError && <span className="text-red-600">Upload failed: {uploadError}</span>}
                    {imageNotice && <span className="text-zinc-700">{imageNotice}</span>}
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
                {/* <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50"
                    onClick={doUndo}
                    disabled={!undo}
                    title="Undo last change"
                  >
                    ⟲ Undo
                  </button>
                </div> */}

                <button
                  type="submit"
                  className="rounded-lg border border-black/10 bg-orange-500 px-3.5 py-2 font-semibold text-white shadow disabled:opacity-50 hover:cursor-pointer"
                  disabled={pending}
                >
                  {pending ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Components
// ────────────────────────────────────────────────────────────────────────────

// Floating panel wrapper
function Panel({ id, title, subtitle, children, ref }: { id: string; title: string; subtitle?: string; children: React.ReactNode; ref: React.RefObject<HTMLDivElement | null> }) {
  return (
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
  )
}

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

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="mb-1 block text-sm font-medium">{children}</label>
);

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

const sanitizeLines = (xs: string[]) => xs.map((s) => s.trim()).filter(Boolean);

