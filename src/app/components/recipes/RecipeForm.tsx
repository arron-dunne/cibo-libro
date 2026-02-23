"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { compressImageFile } from "@/lib/images/compress";
import { MAX_SIZE_BYTES } from "@/lib/images/constants";
import { RecipeFormRecipe } from "@/types/recipe";
import { X, ChefHat, Tag as TagIcon, CircleAlert } from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

interface RecipeFormProps {
  mode: "new" | "edit";
  recipe?: Recipe; // optional existing recipe data
  action: (
    recipe: RecipeFormRecipe,
  ) => Promise<{ success: boolean; slug?: string; error?: string }>; // server action for handling submitted recipe
}

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
  // form states
  const [ingredients, setIngredients] = useState<string[]>(
    recipe?.ingredients ?? [""],
  );
  const [steps, setSteps] = useState<string[]>(recipe?.steps ?? [""]);
  const [tags, setTags] = useState<string[]>(recipe?.tags ?? []);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // picture states
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageNotice, setImageNotice] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (uploading || deleting) {
      alert("Please wait until the image processing finishes before saving.");
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const prepMinsRaw = formData.get("prepMins") as string;
      const cookMinsRaw = formData.get("cookMins") as string;
      const servingsRaw = formData.get("servings") as string;
      const note = formData.get("note") as string;

      const result = await action({
        id: recipe?.id ?? null,
        title,
        description,
        prepMins: prepMinsRaw ? Number(prepMinsRaw) : null,
        cookMins: cookMinsRaw ? Number(cookMinsRaw) : null,
        servings: servingsRaw ? Number(servingsRaw) : null,
        ingredients: sanitizeLines(ingredients),
        steps: sanitizeLines(steps),
        tags,
        note,
        imageKey,
      });

      if (result.success && result.slug) {
        redirect(`/view/${result.slug}`);
      } else {
        setSaveError(result.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setSaveError("Something went wrong. Please try again.");
    }

    setSaving(false);
  };

  const addRow = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter((xs) => [...xs, ""]);

  const removeRow = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    idx: number,
  ) => setter((xs) => (xs.length > 1 ? xs.filter((_, i) => i !== idx) : xs));

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
    (
      setter: React.Dispatch<React.SetStateAction<string[]>>,
      idx: number,
      selector: string,
    ) =>
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
    if (mode != "edit" || !recipe?.imageKey) return;

    const scopedImageKey = recipe.imageKey;

    async function loadPreview() {
      try {
        const res = await fetch("/api/images/sign-download", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ key: scopedImageKey }),
        });
        if (!res.ok) throw new Error("Failed to sign image URL");
        const { url } = (await res.json()) as { url: string };
        setImagePreview(url);
        setImageKey(scopedImageKey);
      } catch (err) {
        console.error("Error fetching signed image URL:", err);
        setImagePreview(null);
      }
    }

    loadPreview();
  }, [mode, recipe?.imageKey]);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setImageNotice(null);

    const raw = e.target.files?.[0];
    if (!raw) return;

    // 1) Instant preview swap (optimistic)
    const localUrl = URL.createObjectURL(raw);
    setImagePreview(localUrl);

    // 2) If there was a previous image, remove it silently
    const previousKey = imageKey;
    if (previousKey) {
      // Fire-and-forget delete (cleanup handled by background job if it fails)
      deleteImageSilent(previousKey);
      setImageKey(null);
    }

    // 3) Upload new image
    setUploading(true);
    try {
      const compressed = await compressImageFile(raw, {
        maxWidth: 1600,
        maxHeight: 1600,
        maxBytes: MAX_SIZE_BYTES,
        preferWebP: true,
      });
      if (compressed.size > MAX_SIZE_BYTES) {
        throw new Error(
          `File too large (max ${Math.floor(MAX_SIZE_BYTES / (1024 * 1024))} MB)`,
        );
      }

      const signRes = await fetch("/api/images/sign-upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contentType: compressed.type,
          size: compressed.size,
        }),
      });
      if (!signRes.ok) throw new Error(`Sign failed: ${signRes.status}`);
      const { method, url, key, requiredHeaders } =
        (await signRes.json()) as SignUploadResponse;

      const putOnce = async () => {
        const r = await fetch(url, {
          method,
          headers: requiredHeaders,
          body: compressed,
        });
        if (!r.ok) throw new Error(`Upload failed: ${r.status}`);
      };
      try {
        await putOnce();
      } catch {
        await putOnce();
      }

      setImageKey(key);

      const fileName =
        (raw.name.replace(/\.\w+$/, "") || "image") +
        extFromMime(compressed.type);
      const compressedFile = new File([compressed], fileName, {
        type: compressed.type,
      });
      setFileInput(compressedFile);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  // Set the <input type="file"> to a given File (so it isn't left empty)
  function setFileInput(file: File) {
    try {
      const dt = new DataTransfer();
      dt.items.add(file);
      if (fileInputRef.current) fileInputRef.current.files = dt.files;
    } catch {
      // Not critical; some environments might block programmatic assignment
    }
  }

  async function deleteImage() {
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

  // Silent delete used only during "swap" (don't show Deleting…, don't clear preview/input)
  async function deleteImageSilent(key: string) {
    if (!key) return;

    // Fire-and-forget the server cleanup; no UI updates here
    fetch("/api/images/delete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key }),
    }).catch(() => {});
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl w-full mx-auto mt-8">
      <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
        {/* Summary Panel */}
        <Panel
          header={ mode === "new" ? "Create a New Recipe" : "Edit Your Recipe" }
          subheader="Fill in the details and save it to your cookbook."
          first
          icon={
            <ChefHat aria-hidden="true" className="w-8 h-8 sm:w-10 sm:h-10" />
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <input
                id="title"
                name="title"
                type="text"
                className="w-full px-3 py-2.5 rounded-2xl border border-zinc-300 bg-white"
                placeholder="e.g. Spaghetti Bolognese"
                required
                defaultValue={recipe?.title ?? ""}
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full px-3 py-2.5 rounded-2xl border border-zinc-300 bg-white"
                defaultValue={recipe?.description ?? ""}
              />
            </div>

            <div>
              <Label>Prep time (min)</Label>
              <input
                name="prepMins"
                type="number"
                inputMode="numeric"
                className="w-full px-3 py-2.5 rounded-2xl border border-zinc-300 bg-white"
                defaultValue={recipe?.prepMins?.toString() ?? ""}
              />
            </div>
            <div>
              <Label>Cook time (min)</Label>
              <input
                name="cookMins"
                type="number"
                inputMode="numeric"
                className="w-full px-3 py-2.5 rounded-2xl border border-zinc-300 bg-white"
                defaultValue={recipe?.cookMins?.toString() ?? ""}
              />
            </div>
            <div>
              <Label>Servings</Label>
              <input
                name="servings"
                type="number"
                inputMode="numeric"
                className="w-full px-3 py-2.5 rounded-2xl border border-zinc-300 bg-white"
                defaultValue={recipe?.servings?.toString() ?? ""}
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
          header="Ingredients"
          subheader="List what you'll need. Press Enter to add more."
        >
          <div className="flex flex-col gap-3">
            {ingredients.map((val, i) => (
              <div key={`ing-${i}`} className="flex items-center gap-4">
                <input
                  type="text"
                  aria-label={`Ingredient ${i + 1}`}
                  className="ingredient-input w-full px-3 py-2.5 rounded-2xl border border-zinc-300 bg-white"
                  placeholder={i === 0 ? "e.g. 250g dried pasta" : ""}
                  value={val}
                  onChange={(e) =>
                    setIngredients((xs) =>
                      xs.map((x, idx) => (idx === i ? e.target.value : x)),
                    )
                  }
                  onPaste={onPasteMulti(setIngredients, i)}
                  onKeyDown={handleEnter(
                    setIngredients,
                    i,
                    "input.ingredient-input",
                  )}
                />

                <button
                  type="button"
                  className="shrink-0 w-10 h-10 flex items-center justify-center
              bg-linear-to-br from-slate-100 to-slate-200
              rounded-full text-slate-800 border border-slate-300
              cursor-pointer hover:brightness-90 active:brightness-75"
                  onClick={() => removeRow(setIngredients, i)}
                  disabled={ingredients.length === 1}
                  aria-label="Remove ingredient"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <div>
              <button
                type="button"
                className="mt-2 px-4 h-11 flex gap-2 items-center bg-linear-to-br from-slate-100 to-slate-200 rounded-full text-slate-800 border border-slate-300 cursor-pointer hover:brightness-90 active:brightness-75"
                onClick={() => addRow(setIngredients)}
              >
                Add Ingredient
              </button>
            </div>
          </div>
        </Panel>

        {/* Steps */}
        <Panel
          header="Steps"
          subheader="Walk through how to make it, one step at a time."
        >
          <div className="flex flex-col gap-3">
            {steps.map((val, i) => (
              <div key={`step-${i}`} className="flex items-start gap-4">
                <textarea
                  rows={2}
                  aria-label={`Step ${i + 1}`}
                  className="step-input w-full px-3 py-2.5 rounded-2xl border border-zinc-300 bg-white"
                  placeholder={
                    i === 0 ? "e.g. Preheat oven to 180°C (fan)." : ""
                  }
                  value={val}
                  onChange={(e) =>
                    setSteps((xs) =>
                      xs.map((x, idx) => (idx === i ? e.target.value : x)),
                    )
                  }
                />

                <button
                  type="button"
                  className="shrink-0 w-10 h-10 flex items-center justify-center
              bg-linear-to-br from-slate-100 to-slate-200
              rounded-full text-slate-800 border border-slate-300
              cursor-pointer hover:brightness-90 active:brightness-75"
                  onClick={() => removeRow(setSteps, i)}
                  disabled={steps.length === 1}
                  aria-label="Remove step"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <div>
              <button
                type="button"
                className="mt-2 px-4 h-11 flex gap-2 items-center bg-linear-to-br from-slate-100 to-slate-200 rounded-full text-slate-800 border border-slate-300 cursor-pointer hover:brightness-90 active:brightness-75"
                onClick={() => addRow(setSteps)}
              >
                Add Step
              </button>
            </div>
          </div>
        </Panel>

        {/* Notes */}
        <Panel
          header="Notes"
          subheader="Preparation notes, variations, serving ideas, or any other personal touches."
        >
          <textarea
            name="note"
            rows={3}
            className="w-full px-3 py-2.5 rounded-2xl border border-zinc-300 bg-white"
            defaultValue={recipe?.note ?? ""}
          />
        </Panel>

        {/* Cover Image */}
        <Panel
          header="Picture"
          subheader="Choose a cover picture (JPEG, PNG, WebP)"
        >
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onPick}
              className="block w-full rounded-2xl border border-slate-300 bg-linear-to-br from-slate-100 to-slate-200 px-3 py-2.5 hover:brightness-90 active:brightness-75 cursor-pointer"
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

              {!uploading && !deleting && imageKey && !uploadError && (
                <div className="flex items-center gap-3">
                  <span className="text-emerald-600">
                    Uploaded successfully
                  </span>
                  <button
                    type="button"
                    disabled={uploading || deleting}
                    onClick={async () => {
                      // This path is an explicit *delete*; shows "Deleting…"
                      await deleteImage();
                    }}
                    className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              )}

              {uploadError && (
                <span className="text-red-600">
                  Upload failed: {uploadError}
                </span>
              )}
              {imageNotice && (
                <span className="text-zinc-700">{imageNotice}</span>
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

        {/* Save button */}
        <div className="sticky bottom-4 z-10 flex flex-col items-center gap-2">
          {saveError && (
            <div className="w-full max-w-sm rounded-2xl border border-red-500 bg-red-200/90 px-4 py-3 text-sm text-red-600 font-semibold flex items-center gap-2">
              <CircleAlert height={18} className="shrink-0" />
              {saveError}
            </div>
          )}
          <div className="rounded-full w-full max-w-sm bg-white/60 backdrop-blur border border-white/70 shadow-lg px-4 py-3">
            <button
              type="submit"
              className="w-full rounded-full bg-linear-to-br from-green-500 to-lime-400 px-6 py-3 text-xl font-bold text-green-950 border border-green-500 shadow-lg disabled:opacity-50 cursor-pointer hover:brightness-90 active:brightness-75"
              disabled={saving || uploading || deleting}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-green-950 border-t-transparent rounded-full"></span>
                  Saving…
                </span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Components
// ────────────────────────────────────────────────────────────────────────────

// Floating panel wrapper
function Panel({
  header,
  subheader,
  first,
  icon,
  children,
}: {
  header: string;
  subheader?: string;
  first?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
      {first ? (
        <div className="mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-6 md:mb-8">
          {icon && (
            <div className="hidden sm:flex w-20 h-18 items-center justify-center rounded-3xl bg-linear-to-br from-orange-100 to-rose-100 text-rose-500 border border-rose-200">
              {icon}
            </div>
          )}
          <div className="text-center sm:text-start">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              {header}
            </h1>
            {subheader && (
              <p className="text-gray-700">{subheader}</p>
            )}
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-2xl font-bold">{header}</h3>
          {subheader && (
            <p className="mt-1 text-sm text-zinc-600">{subheader}</p>
          )}
        </>
      )}

      <div className={first ? "" : "mt-4"}>{children}</div>
    </section>
  );
}

function TagsEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (xs: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const clean = draft.trim().replace(/^./, (c) => c.toUpperCase());
    if (!clean) return;
    if (!value.includes(clean)) onChange([...value, clean]);
    setDraft("");
  };
  const remove = (t: string) => onChange(value.filter((x) => x !== t));
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
            if (e.key === "Backspace" && draft === "" && value.length)
              remove(value[value.length - 1]);
          }}
          placeholder="e.g. Dinner, Healthy..."
          className="w-full rounded-2xl border border-zinc-300 bg-white/95 px-3 py-2.5"
          aria-label="Add tag"
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 px-3 py-2 flex items-center gap-2
              bg-linear-to-br from-slate-100 to-slate-200
              rounded-full text-sm text-slate-800 border border-slate-300
              cursor-pointer hover:brightness-90 active:brightness-75"
        >
          <TagIcon size={16} />
          Add
        </button>
      </div>

      {value.length >= 1 && (
        <div className="w-full h-max mb-1 flex flex-wrap gap-2">
          {value.map((t) => (
            <div
              key={t}
              className="group flex items-center gap-1 rounded-full border border-orange-200 bg-orange-200/50 text-orange-600 px-2 py-1 font-medium text-sm"
            >
              <span className="ml-1">{t}</span>
              <button
                type="button"
                onClick={() => remove(t)}
                aria-label={`Remove tag ${t}`}
                className="rounded-full p-0.5 cursor-pointer"
              >
                <X size={14} className="text-orange-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Label = ({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) => (
  <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">
    {children}
  </label>
);

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

const sanitizeLines = (xs: string[]) => xs.map((s) => s.trim()).filter(Boolean);

function extFromMime(mime: string) {
  if (mime === "image/webp") return ".webp";
  if (mime === "image/png") return ".png";
  return ".jpg";
}
