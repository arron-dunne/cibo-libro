'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ExternalLink,
  Globe,
  Image as ImageIcon,
  Link2,
  Star,
  Tag as TagIcon,
  X,
  ShieldAlert,
  Save,
  Trash2,
} from 'lucide-react';

type OgMeta = {
  url: string;
  siteName: string;
  title: string;
  description?: string;
  imageUrl?: string;
  robotsBlocked?: boolean;
};

const MOCK_OG: OgMeta = {
  url: 'https://www.example.com/perfect-roast-chicken',
  siteName: 'Example Food Blog',
  title: 'Perfect Roast Chicken with Garlic & Lemon',
  description:
    'Crispy skin, juicy meat, and a simple pan sauce. A Sunday classic ready in 90 minutes.',
  imageUrl: '', // leave empty to exercise the placeholder state
  robotsBlocked: true,
};

export default function Page() {
  // --- Local “form” state (mock) ---
  const [tags, setTags] = useState<string[]>(['Dinner', 'Easy']);
  const [inputTag, setInputTag] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const og = useMemo(() => MOCK_OG, []);

  function addTag(v: string) {
    const clean = v.trim();
    if (!clean) return;
    if (!tags.includes(clean)) setTags((t) => [...t, clean]);
    setInputTag('');
  }

  function removeTag(v: string) {
    setTags((t) => t.filter((x) => x !== v));
  }

  // --- Render ---
  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-orange-50 to-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
        {/* Header / Status */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-orange-200/70 bg-white/80 p-4 shadow-sm backdrop-blur">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="grow">
            <h1 className="text-lg font-semibold text-gray-900">
              We couldn’t import the full recipe
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              The website’s settings or terms prevent automated imports. You can still save a{' '}
              <span className="font-medium text-gray-900">Link Card</span> with safe metadata and
              your own tags/notes.
            </p>
          </div>
          {og.robotsBlocked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              <ShieldAlert className="h-4 w-4" />
              robots blocked
            </span>
          )}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Preview Card */}
          <section
            aria-labelledby="preview-title"
            className="rounded-2xl border bg-white shadow-sm"
          >
            <header className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="h-4 w-4" />
                <span className="truncate">{og.siteName}</span>
                <span className="text-gray-300">•</span>
                <a
                  href={og.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-gray-700 underline decoration-gray-300 underline-offset-2 hover:text-gray-900"
                >
                  View original <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-600">
                <Link2 className="h-3.5 w-3.5" />
                Link Card
              </div>
            </header>

            {/* Image / Placeholder */}
            <div className="relative">
              {og.imageUrl ? (
                // In mock mode we avoid next/image to keep drop-in simple
                <img
                  src={og.imageUrl}
                  alt={og.title}
                  className="aspect-[16/9] w-full rounded-t-2xl object-cover"
                />
              ) : (
                <div className="aspect-[16/9] w-full rounded-t-2xl bg-gradient-to-br from-orange-100 to-rose-100">
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="flex items-center gap-3 rounded-xl border border-orange-200/60 bg-white/70 px-4 py-2 text-orange-700 shadow-sm backdrop-blur">
                      <ImageIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">No preview image available</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="space-y-3 px-5 py-5">
              <h2 id="preview-title" className="text-xl font-semibold text-gray-900">
                {og.title}
              </h2>
              {og.description ? (
                <p className="line-clamp-3 text-sm text-gray-600">{og.description}</p>
              ) : (
                <p className="text-sm text-gray-500">No description available.</p>
              )}

              {/* Your data preview */}
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
                        <span
                          key={t}
                          className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                        >
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
                    <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Your note
                    </span>
                    <p className="mt-1 whitespace-pre-wrap">{notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <footer className="border-t px-5 py-4 text-xs text-gray-500">
              We only save safe metadata and your own inputs. Full recipes from other sites aren’t
              copied. You’ll always have a link back to the original.
            </footer>
          </section>

          {/* Form Panel */}
          <section
            aria-labelledby="form-title"
            className="rounded-2xl border bg-white shadow-sm"
          >
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
                    placeholder="Add a tag and press Enter (e.g., Weeknight)"
                    value={inputTag}
                    onChange={(e) => setInputTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
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
                <p className="mt-1 text-xs text-gray-500">
                  Tip: keep tags short—like &quot;Vegetarian&quot; or &quot;15-minute&quot;.
                </p>
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
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 active:translate-y-px"
                  onClick={() => alert('Discard (mock)')}
                >
                  <Trash2 className="h-4 w-4" />
                  Discard
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 active:translate-y-px"
                  onClick={() =>
                    alert(
                      `Save (mock)\n\nURL: ${og.url}\nTags: ${tags.join(
                        ', '
                      )}\nRating: ${rating}\nNotes: ${notes ? notes.slice(0, 120) + '…' : ''}`
                    )
                  }
                >
                  <Save className="h-4 w-4" />
                  Save Link Card
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/**
 * Stars component (accessible; clickable; keyboard-friendly)
 */
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
            className={`h-5 w-5 ${
              n <= rating ? 'fill-yellow-400 stroke-yellow-500' : 'stroke-gray-300 text-gray-300'
            }`}
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
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onClick={() => onChange(n)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') onChange(Math.min(5, rating + 1));
              if (e.key === 'ArrowLeft') onChange(Math.max(0, rating - 1));
            }}
            className="rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <Star
              className={`h-6 w-6 transition ${
                active ? 'fill-yellow-400 stroke-yellow-500' : 'stroke-gray-300 text-gray-300'
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
