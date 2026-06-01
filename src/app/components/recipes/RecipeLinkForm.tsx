"use client";

import { redirect } from "next/navigation";
import { useState } from "react";
import { X, Tag as TagIcon, CircleAlert, Loader2 } from "lucide-react";
import { Header, SubHeader } from "@/app/components/text/Headers";
import { Input, TextArea } from "@/app/components/forms/Inputs";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/app/components/buttons/Buttons";
import { Tag } from "../tags/Tags";
import type { RecipeLinkFormRecipe, RecipeFormActionResponse } from "@/types/recipe";

interface RecipeLinkFormProps {
  recipe: Recipe;
  action: (
    recipe: RecipeLinkFormRecipe,
  ) => Promise<RecipeFormActionResponse>;
}

export default function RecipeLinkForm({ recipe, action }: RecipeLinkFormProps) {
  const [tags, setTags] = useState<string[]>(recipe.tags ?? []);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    let redirectSlug: string | null = null;

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const result = await action({
        id: recipe.id ?? null,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        tags,
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

  return (
    <div className="mt-12 max-w-3xl w-full mx-auto">
      <form className="space-y-16" onSubmit={handleSubmit}>
        <section className="space-y-6">
          <div className="space-y-2">
            <Header textSize="text-5xl">Edit recipe link</Header>
            <SubHeader>Update the details for this saved link.</SubHeader>
          </div>

          <Input
            label="Title"
            name="title"
            type="text"
            placeholder="e.g. Spaghetti Bolognese"
            required
            defaultValue={recipe.title ?? ""}
          />

          <TextArea
            label="Description"
            name="description"
            rows={3}
            defaultValue={recipe.description ?? ""}
          />

          <TagsEditor value={tags} onChange={setTags} />
        </section>

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
              <>Save</>
            )}
          </PrimaryButton>
        </div>
      </form>
    </div>
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
        <PrimaryButton type="button" height="h-12" onClick={add}>
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
