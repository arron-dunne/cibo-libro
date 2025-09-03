"use client";

import { useState } from "react";
import Link from "next/link";
import { Save, Tag as TagIcon, X, Star, Trash2 } from "lucide-react";

export default function ClientLinkCardForm({ initialUrl }: { initialUrl: string }) {
  const [tags, setTags] = useState<string[]>(["Dinner", "Easy"]);
  const [inputTag, setInputTag] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState("");

  function addTag(v: string) {
    const clean = v.trim();
    if (!clean) return;
    setTags((t) => (t.includes(clean) ? t : [...t, clean]));
    setInputTag("");
  }

  function removeTag(v: string) {
    setTags((t) => t.filter((x) => x !== v));
  }

  return (
    <section aria-labelledby="form-title" className="rounded-2xl border bg-white shadow-sm">
      <header className="border-b px-5 py-4">
        <h2 id="form-title" className="text-base font-semibold text-gray-900">
          Add your details
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Make this link card yours—add tags, a rating, and a quick note.
        </p>
      </header>

      <div className="space-y-6 px-5 py-5">
        {/* Rating */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Rating</label>
          <Stars rating={rating} onChange={setRating} />
          <p className="mt-1 text-xs text-gray-500">Optional</p>
        </div>

        {/* Tags */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => removeTag(t)}
                className="group inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100"
                aria-label={`Remove tag ${t}`}
              >
                {t}
                <X className="h-3.5 w-3.5 text-gray-500 group-hover:text-gray-700" />
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              className="block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              placeholder='Add a tag and press Enter (e.g., "Weeknight")'
              value={inputTag}
              onChange={(e) => setInputTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(inputTag);
                }
              }}
              aria-label="Add tag"
            />
            <button
              type="button"
              onClick={() => addTag(inputTag)}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black active:translate-y-px"
            >
              <TagIcon className="h-4 w-4" />
              Add
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">Tip: keep tags short—like “Vegetarian” or “15-minute”.</p>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="mb-2 block text-sm font-medium text-gray-900">
            Notes
          </label>
          <textarea
            id="notes"
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Use 2 lemons, add rosemary; reduce salt."
            className="block w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
          <p className="mt-1 text-xs text-gray-500">Private to you.</p>
        </div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 border-t bg-white/85 px-5 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Link
            href="/import"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 active:translate-y-px"
          >
            <Trash2 className="h-4 w-4" />
            Discard
          </Link>

          {/* TODO: replace with server action */}
          <button
            type="button"
            onClick={() => {
              const payload = { sourceUrl: initialUrl, rating, tags, notes };
              alert(`Save (mock)\n\n${JSON.stringify(payload, null, 2)}`);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 active:translate-y-px"
          >
            <Save className="h-4 w-4" />
            Save Link Card
          </button>
        </div>
      </div>
    </section>
  );
}

/** Minimal accessible stars */
function Stars({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (n: number) => void;
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div role="radiogroup" aria-label="Select rating" className="flex items-center gap-1">
      {stars.map((n) => {
        const active = n <= rating;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") onChange(Math.min(5, rating + 1));
              if (e.key === "ArrowLeft") onChange(Math.max(0, rating - 1));
            }}
            className="rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <Star
              className={`h-6 w-6 transition ${
                active ? "fill-yellow-400 stroke-yellow-500" : "stroke-gray-300 text-gray-300"
              }`}
            />
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => onChange(0)}
        className="ml-2 rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
        aria-label="Clear rating"
      >
        Clear
      </button>
    </div>
  );
}
