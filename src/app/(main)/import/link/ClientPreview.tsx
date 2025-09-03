"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Globe, ExternalLink, Link2, Image as ImageIcon, AlertTriangle, ShieldAlert, X, Tag as TagIcon, Trash2, Save, Star } from "lucide-react";

export function ClientPreview() {
  // Read the live form state via custom events so the preview updates without lifting state up
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    function onMsg(e: Event) {
      const ce = e as CustomEvent;
      if (ce.detail?.kind === "link-form-update") {
        setRating(ce.detail.rating ?? 0);
        setTags(ce.detail.tags ?? []);
        setNotes(ce.detail.notes ?? "");
      }
    }
    window.addEventListener("cl:link-form", onMsg as EventListener);
    return () => window.removeEventListener("cl:link-form", onMsg as EventListener);
  }, []);

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-500" />
        <span className="text-gray-700">Your Rating:</span>
        <Stars rating={rating} onChange={() => {}} readOnly />
      </div>

      <div className="flex items-start gap-2 text-sm text-gray-600">
        <TagIcon className="mt-0.5 h-4 w-4" />
        <div className="flex flex-wrap gap-2">
          {tags.length ? (
            tags.map((t) => (
              <span key={t} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                {t}
              </span>
            ))
          ) : (
            <span className="text-gray-500">No tags yet</span>
          )}
        </div>
      </div>

      {notes && (
        <div className="rounded-lg border bg-gray-50 p-3 text-sm text-gray-700">
          <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Your note</span>
          <p className="mt-1 whitespace-pre-wrap">{notes}</p>
        </div>
      )}
    </div>
  );
}

export function FormPanel({ initialUrl }: { initialUrl: string }) {

  const [tags, setTags] = useState<string[]>(["Dinner", "Easy"]);
  const [inputTag, setInputTag] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    // Broadcast to preview panel
    const evt = new CustomEvent("cl:link-form", {
      detail: { kind: "link-form-update", tags, rating, notes },
    });
    window.dispatchEvent(evt);
  }, [tags, rating, notes]);

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
        <p className="mt-1 text-sm text-gray-600">Make this link card yours—add tags, a rating, and a quick note.</p>
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

          {/* TODO: wire this to a server action that persists the link card */}
          <button
            type="button"
            onClick={() => {
              // For now, just show the payload it would send.
              const payload = {
                sourceUrl: initialUrl,
                rating,
                tags,
                notes,
              };
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

/** Accessible star rating */
function Stars({
  rating,
  onChange,
  readOnly = false,
}: {
  rating: number;
  onChange: (n: number) => void;
  readOnly?: boolean;
}) {
  const stars = [1, 2, 3, 4, 5];
  if (readOnly) {
    return (
      <div className="flex items-center gap-1" aria-label={`Your rating: ${rating} of 5`}>
        {stars.map((n) => (
          <Star
            key={n}
            className={`h-5 w-5 ${n <= rating ? "fill-yellow-400 stroke-yellow-500" : "stroke-gray-300 text-gray-300"}`}
          />
        ))}
      </div>
    );
  }
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
            <Star className={`h-6 w-6 transition ${active ? "fill-yellow-400 stroke-yellow-500" : "stroke-gray-300 text-gray-300"}`} />
          </button>
        );
      })}
      {!readOnly && (
        <button
          type="button"
          onClick={() => onChange(0)}
          className="ml-2 rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
          aria-label="Clear rating"
        >
          Clear
        </button>
      )}
    </div>
  );
}
