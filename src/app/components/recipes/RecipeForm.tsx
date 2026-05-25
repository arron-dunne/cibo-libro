"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { compressImageFile } from "@/lib/images/compress";
import { MAX_SIZE_BYTES } from "@/lib/images/constants";
import { RecipeFormRecipe } from "@/types/recipe";
import {
  X,
  Tag as TagIcon,
  CircleAlert,
  ImagePlus,
  Loader2,
} from "lucide-react";
import { FormSubmitButton } from "@/app/components/forms/FormSubmitButton";
import { Header, SubHeader } from "../text/Headers";
import { Input, TextArea } from "../forms/Inputs";
import {
  PrimaryButton,
  SecondaryButton,
  TeriaryButton,
} from "../buttons/Buttons";
import { Tag } from "../tags/Tags";
import Link from "next/link";

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

    let redirectSlug: string | null = null;

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
        redirectSlug = result.slug;
      } else {
        setSaveError(result.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setSaveError("Something went wrong. Please try again.");
    }

    setSaving(false);

    if (redirectSlug) {
      redirect(`/view/${redirectSlug}`);
    }
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

    const raw = e.target.files?.[0];
    if (!raw) return;

    const localUrl = URL.createObjectURL(raw);

    // If there was a previous image, remove it silently
    const previousKey = imageKey;
    if (previousKey) {
      deleteImageSilent(previousKey);
      setImageKey(null);
      setImagePreview(null);
    }

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
      setImagePreview(localUrl);

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
    const keyToDelete = imageKey;

    setDeleting(true);
    try {
      const res = await fetch("/api/images/delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: keyToDelete }),
      });
      if (!res.ok) throw new Error(String(res.status));

      if (fileInputRef.current) fileInputRef.current.value = "";
      setImageKey(null);
      setImagePreview(null);
    } catch {
      // silently fail — image stays visible, user can retry
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
    <div className="mt-12 max-w-3xl w-full mx-auto">
      <form className="space-y-16" onSubmit={handleSubmit}>
        {/* Summary Panel */}
        <section className="space-y-6">
          <div className="space-y-2">
            <Header textSize="text-5xl">
              {recipe ? "Edit recipe" : "Create a new recipe"}
            </Header>
            <SubHeader>
              {recipe
                ? "Update details and save changes."
                : "Fill in the details and save it to your cookbook."}
            </SubHeader>
          </div>

          <Input
            label="Title"
            name="title"
            type="text"
            placeholder="e.g. Spaghetti Bolognese"
            required
            defaultValue={recipe?.title ?? ""}
          />

          <TextArea
            label="Description"
            name="description"
            rows={3}
            defaultValue={recipe?.description ?? ""}
          />

          <div className="flex flex-col md:flex-row gap-4">
            <Input
              label="Prep time (mins)"
              name="prepMins"
              type="number"
              inputMode="numeric"
              defaultValue={recipe?.prepMins?.toString() ?? ""}
            />
            <Input
              label="Cook time (mins)"
              name="cookMins"
              type="number"
              inputMode="numeric"
              defaultValue={recipe?.cookMins?.toString() ?? ""}
            />
          </div>

          <div className="w-full md:w-1/2">
            <Input
              label="Servings"
              name="servings"
              type="number"
              inputMode="numeric"
              defaultValue={recipe?.servings?.toString() ?? ""}
            />
          </div>

          <TagsEditor value={tags} onChange={setTags} />
        </section>

        {/* Ingredients */}
        <section className="space-y-6">
          <div className="ml-2 space-y-2">
            <Header textSize="text-4xl">Ingredients</Header>
            <SubHeader>
              List what you'll need. Press Enter to add more.
            </SubHeader>
          </div>
          <div className="flex flex-col gap-4">
            {ingredients.map((val, i) => (
              <div key={`ing-${i}`} className="flex items-center gap-2">
                <Input
                  name={`ing-${i}`}
                  type="text"
                  aria-label={`Ingredient ${i + 1}`}
                  className="ingredient-input"
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
                <SecondaryButton
                  width="w-10"
                  height="h-10"
                  type="button"
                  onClick={() => removeRow(setIngredients, i)}
                  disabled={ingredients.length === 1}
                  aria-label="Remove ingredient"
                >
                  <X size={20} />
                </SecondaryButton>
              </div>
            ))}
          </div>
          <PrimaryButton type="button" onClick={() => addRow(setIngredients)}>
            Add Ingredient
          </PrimaryButton>
        </section>

        {/* Steps */}
        <section className="space-y-6">
          <div className="ml-2 space-y-2">
            <Header textSize="text-4xl">Steps</Header>
            <SubHeader>
              Walk through how to make it, one step at a time.
            </SubHeader>
          </div>
          <div className="flex flex-col gap-4">
            {steps.map((val, i) => (
              <div key={`step-${i}`} className="flex items-start gap-4">
                <TextArea
                  name={`step-${i}`}
                  rows={2}
                  aria-label={`Step ${i + 1}`}
                  className="step-input"
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
                <SecondaryButton
                  width="w-10"
                  height="h-10"
                  type="button"
                  onClick={() => removeRow(setSteps, i)}
                  disabled={steps.length === 1}
                  aria-label="Remove step"
                >
                  <X size={20} />
                </SecondaryButton>
              </div>
            ))}
          </div>

          <PrimaryButton type="button" onClick={() => addRow(setSteps)}>
            Add Step
          </PrimaryButton>
        </section>

        {/* Notes */}
        {/* <Panel
          header="Notes"
          subheader="Preparation notes, variations, serving ideas, or any other personal touches."
        >
          <textarea
            name="note"
            rows={3}
            className="w-full px-3 py-2.5 rounded-2xl border border-zinc-300 bg-white"
            defaultValue={recipe?.note ?? ""}
          />
        </Panel> */}

        {/* Cover Image */}
        <section className="space-y-6">
          <div className="ml-2 space-y-2">
            <Header textSize="text-4xl">Picture</Header>
            <SubHeader>Choose a cover image to show with your recipe</SubHeader>
          </div>

          <div className="w-full">
            {imagePreview ? (
              /* Success state: preview + remove button */
              <div className="space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/80">
                  <Image
                    src={imagePreview}
                    alt="Cover image preview"
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                <SecondaryButton
                  type="button"
                  onClick={deleteImage}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <span>Removing…</span>
                      <Loader2 size={20} className="animate-spin" />
                    </>
                  ) : (
                    "Remove photo"
                  )}
                </SecondaryButton>
              </div>
            ) : (
              /* Upload zone: idle, uploading, or error */
              <label
                className={`m-2 group block rounded-2xl border-3 border-dashed border-rose-500 transition-colors
                  ${uploading ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:brightness-125 hover:bg-white/30"}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onPick}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 text-center">
                  {uploading ? (
                    <>
                      <Loader2
                        size={42}
                        className="text-rose-500 animate-spin"
                      />
                      <p className="text-slate-800">Uploading image…</p>
                    </>
                  ) : uploadError ? (
                    <>
                      <CircleAlert size={38} className="text-rose-500" />

                      <div className="space-y-1">
                        <p className="text-rose-600 font-semibold">
                          {uploadError}
                        </p>
                        <div className="text-sm text-slate-800 flex gap-1">
                          <span>
                            If this problem persists, please try again later or
                          </span>
                          <Link href="/support/issues">
                            <TeriaryButton className="z-10">
                              contact support
                            </TeriaryButton>
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImagePlus size={38} className="text-rose-500" />
                      <div className="space-y-1">
                        <p className="text-slate-800">
                          Drop your photo here or{" "}
                          <span className="font-extrabold bg-linear-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                            click to browse
                          </span>
                        </p>
                        <p className="text-sm text-slate-600">Max 20 MB</p>
                      </div>
                    </>
                  )}
                </div>
              </label>
            )}
          </div>
        </section>

        {/* Save button */}
        {saveError && (
          <div className="flex justify-center">
            <div className="w-full max-w-sm rounded-2xl border border-red-500 bg-red-200/90 px-4 py-3 text-sm text-red-600 font-semibold flex items-center gap-2">
              <CircleAlert height={18} className="shrink-0" />
              {saveError}
            </div>
          </div>
        )}

        <div className="pt-8 max-w-md mx-auto">
          <PrimaryButton
            className="shadow-xl shadow-rose-300/50"
            size="lg"
            width="w-full"
            type="submit"
          >
            {saving ? (
              <>
                Saving...
                <Loader2 size={28} className="ml-2 animate-spin" />
              </>
            ) : (
              <>Save Recipe</>
            )}
          </PrimaryButton>
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
    <section>
      <Header textSize={first ? "text-5xl" : "text-3xl"}>{header}</Header>
      <SubHeader>{subheader}</SubHeader>
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
    <div className="w-full">
      <div className="w-full flex items-end gap-2">
        <Input
          label="Tags (press enter to add)"
          name="tags"
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
          placeholder="Dinner, Healthy, Party ..."
          aria-label="Add tag"
        />

        <PrimaryButton height="h-12" onClick={add}>
          Add
          <TagIcon size={16} />
        </PrimaryButton>
      </div>

      {value.length >= 1 && (
        <div className="w-full h-max mt-6 flex flex-wrap gap-2">
          {value.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => remove(t)}
              aria-label={`Remove tag ${t}`}
            >
              <Tag interactive>
                <span>{t}</span>
                <X size={16} className="ml-2" />
              </Tag>
            </button>
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
