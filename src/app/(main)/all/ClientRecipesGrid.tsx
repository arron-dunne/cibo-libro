"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * ClientRecipesGrid — R2-aware, beautiful recipe library grid (no expanding cards)
 *
 * Key changes for your schema & image flow:
 * - Uses `prepMins` and `cookMins` (no `totalMinutes`)
 * - Uses `imageKey` (not `imageUrl`) and fetches a **signed download URL** from `/api/images/sign-download`
 * - In-memory caching of signed URLs to avoid repeat fetches
 * - Graceful skeletons + fallbacks
 *
 * Notes:
 * - The sign-download route is called **client-side**; we try POST { key } first, then GET ?key=... as a fallback.
 * - `Image` is set to `unoptimized` to avoid Next remotePatterns friction while you finalize hostnames.
 */

export type Recipe = {
  id: string;
  title: string;
  description?: string | null;
  imageKey?: string | null; // ← key in R2
  tags?: string[] | null;
  prepMins?: number | null;
  cookMins?: number | null;
  servings?: number | null;
  sourceUrl?: string | null;
};

export type ClientRecipesGridProps = {
  recipes: Recipe[];
  initialQuery?: string;
  initialTags?: string[];
  initialSort?: SortOptionKey;
};

/** Sort options */
const SORT_OPTIONS = [
  { key: "recent" as const, label: "Recently updated" },
  { key: "title" as const, label: "Title A→Z" },
  { key: "time" as const, label: "Total time" },
];

type SortOptionKey = (typeof SORT_OPTIONS)[number]["key"];

export default function ClientRecipesGrid({
  recipes,
  initialQuery = "",
  initialTags = [],
  initialSort = "recent",
}: ClientRecipesGridProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [sortBy, setSortBy] = useState<SortOptionKey>(initialSort);

  // Collect unique tags (by frequency, then A→Z)
  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of recipes) for (const t of r.tags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0])).map(([t]) => t);
  }, [recipes]);

  const normalized = useMemo(() =>
    recipes.map((r) => ({
      ...r,
      _q: [r.title, r.description, ...(r.tags ?? [])].join(" ").toLowerCase(),
      _time: ((r.prepMins ?? 0) + (r.cookMins ?? 0)) || undefined,
    })),
  [recipes]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = normalized.filter((r) => {
      const matchesQuery = q ? r._q.includes(q) : true;
      const matchesTags = selectedTags.length ? (r.tags ?? []).some((t) => selectedTags.includes(t)) : true;
      return matchesQuery && matchesTags;
    });
    switch (sortBy) {
      case "title":
        list = list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "time":
        list = list.sort((a, b) => (a._time ?? 1e9) - (b._time ?? 1e9));
        break;
      case "recent":
      default:
        // Assume server returned updatedAt desc → keep order
        break;
    }
    return list;
  }, [normalized, query, selectedTags, sortBy]);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  return (
    <div className="flex flex-col gap-5">
      {/* Filter Bar */}
      <div className="sticky top-16 z-10 -mx-2 px-2 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/95 border-b border-zinc-200">
        <div className="mx-auto max-w-7xl flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <label className="relative flex-1 min-w-[220px]">
              <span className="sr-only">Search recipes</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search recipes, tags…"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 pr-10 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                aria-label="Search recipes"
              />
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </label>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-zinc-600">Sort</label>
              <select
                id="sort"
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOptionKey)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {allTags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={
                      "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition " +
                      (active ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm" : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50")
                    }
                    aria-pressed={active}
                  >
                    {tag}
                  </button>
                );
              })}
              {selectedTags.length > 0 && (
                <button onClick={() => setSelectedTags([])} className="ml-1 whitespace-nowrap rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50">Clear</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results meta */}
      <div className="mx-auto max-w-7xl px-2">
        <div className="mb-2 text-sm text-zinc-600">
          Showing <strong>{visible.length}</strong> of {recipes.length} recipes
          {selectedTags.length > 0 && <span className="ml-2">• Tags: {selectedTags.join(", ")}</span>}
        </div>

        {/* Empty states */}
        {recipes.length === 0 && <EmptyState title="No recipes yet" subtitle="Add your first recipe to see it here." />}
        {recipes.length > 0 && visible.length === 0 && (
          <EmptyState title="No matches" subtitle="Try a different search or clear your tag filters." actionLabel="Clear filters" onAction={() => { setQuery(""); setSelectedTags([]); }} />
        )}

        {/* Grid */}
        <ul className="grid auto-rows-[1fr] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 md:gap-5" role="list">
          {visible.map((r) => (
            <li key={r.id}>
              <RecipeCard recipe={r} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const minutes = ((recipe.prepMins ?? 0) + (recipe.cookMins ?? 0)) || undefined;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md focus-within:shadow-md" tabIndex={-1}>
      {/* Media */}
      <div className="relative aspect-[4/3] w-full bg-zinc-100">
        <SignedImage imageKey={recipe.imageKey} alt={recipe.title} />
        {/* Hover overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute bottom-2 left-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href={`/view/${recipe.id}`} className="pointer-events-auto rounded-full bg-white/95 px-3 py-1.5 text-sm font-medium text-zinc-900 shadow hover:bg-white">View</Link>
          <Link href={`/cook/${recipe.id}`} className="pointer-events-auto rounded-full bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-orange-700">Cook</Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-zinc-900">{recipe.title}</h3>
        {recipe.description && <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{recipe.description}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
          {minutes ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1"><ClockIcon className="h-3.5 w-3.5" />{minutes} min</span>
          ) : null}
          {typeof recipe.servings === "number" && recipe.servings > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1"><BowlIcon className="h-3.5 w-3.5" />{recipe.servings} servings</span>
          ) : null}
          {(recipe.tags ?? []).slice(0, 3).map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 font-medium text-orange-700">#{t}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

// Module-scope cache survives re-renders in the same session
const signedUrlCache = new Map<string, string>();

function useSignedImageUrl(key?: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(!!key);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!key) {
      setUrl(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Cache hit
    if (signedUrlCache.has(key)) {
      setUrl(signedUrlCache.get(key)!);
      setLoading(false);
      setError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);

    async function run() {
      try {
        const res = await fetch("/api/images/sign-download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
          signal: controller.signal,
        });

        if (!res.ok) {
          // Try to surface a useful error from the API
          let message = `sign-download failed (${res.status})`;
          try {
            const j = await res.json();
            message = j?.error || j?.message || message;
          } catch {
            // ignore JSON parse errors
          }
          throw new Error(message);
        }

        const data = await res.json();
        const signed =
          data?.url ?? data?.signedUrl ?? data?.signed_url;

        if (typeof signed !== "string" || !signed) {
          throw new Error("No signed URL in response");
        }

        if (key) {
            signedUrlCache.set(key, signed);
            setUrl(signed);
        } else {
            throw new Error("No key provided");    
        }
        setLoading(false);
      } catch (e: any) {
        if (controller.signal.aborted) return;
        setError(e?.message ?? "Failed to obtain signed URL");
        setUrl(null);
        setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [key]);

  return { url, loading, error } as const;
}

/**
 * SignedImage — fetches a signed R2 download URL for an `imageKey` and renders it.
 * - Caches by key to avoid redundant calls.
 * - Shows pretty skeleton while loading; falls back to placeholder on error.
 */
function SignedImage({ imageKey, alt }: { imageKey?: string | null; alt: string }) {
  const { url, loading } = useSignedImageUrl(imageKey);

  return (
    <>
      {/* Image skeleton */}
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-200 to-zinc-100" aria-hidden={true} />
      {url ? (
        <Image
          src={url}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-opacity ${loading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => {/* natural load transitions */}}
          unoptimized
          priority={false}
        />
      ) : (
        <Image
          src={PLACEHOLDER}
          alt="Placeholder"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          unoptimized
          priority={false}
        />
      )}
    </>
  );
}

function EmptyState({ title, subtitle, actionLabel, onAction }: { title: string; subtitle?: string; actionLabel?: string; onAction?: () => void; }) {
  return (
    <div className="my-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
      <div className="mb-2 rounded-full bg-white p-3 shadow-sm"><BookIcon className="h-6 w-6 text-zinc-500" /></div>
      <h4 className="text-lg font-semibold text-zinc-900">{title}</h4>
      {subtitle && <p className="mt-1 max-w-md text-sm text-zinc-600">{subtitle}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} className="mt-4 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700">{actionLabel}</button>
      )}
    </div>
  );
}

/** Lightweight icons (no deps) */
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function BowlIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 12a8 8 0 0 0 16 0H4Z" />
      <path d="M2 12h20" />
    </svg>
  );
}

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M20 22V5a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 5.5v14" />
    </svg>
  );
}

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#f4f4f5'/>
        <stop offset='100%' stop-color='#e4e4e7'/>
      </linearGradient>
    </defs>
    <rect width='400' height='300' fill='url(#g)' />
    <g fill='#a1a1aa'>
      <circle cx='200' cy='120' r='36'/>
      <rect x='140' y='180' width='120' height='14' rx='7'/>
    </g>
  </svg>
`);
