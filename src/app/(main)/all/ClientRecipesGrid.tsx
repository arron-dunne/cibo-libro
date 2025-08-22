"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * ClientRecipesGrid — polished, delightful recipe library UI
 *
 * Improvements:
 * - True responsive grid (max 4 cols desktop → 1 col mobile)
 * - Gorgeous top filter/search bar, centered with subtle glassmorphism
 * - Cards with consistent aspect, soft shadows, playful hover lift
 * - Harmonized typography + spacing
 * - Empty states styled as friendly onboarding moments
 * - Cards are full clickable links to /view/[slug]
 */

export type Recipe = {
  id: string;
  slug?: string | null; // ← for /view/[slug]
  title: string;
  description?: string | null;
  imageKey?: string | null;
  tags?: string[] | null;
  prepMins?: number | null;
  cookMins?: number | null;
  servings?: number | null;
  sourceUrl?: string | null;
};

type SortOptionKey = "recent" | "title" | "time";

const SORT_OPTIONS = [
  { key: "recent" as const, label: "Recently updated" },
  { key: "title" as const, label: "Title A→Z" },
  { key: "time" as const, label: "Total time" },
];

export default function ClientRecipesGrid({ recipes }: { recipes: Recipe[] }) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOptionKey>("recent");

  const normalized = useMemo(() =>
    recipes.map((r) => ({
      ...r,
      _q: [r.title, r.description, ...(r.tags ?? [])].join(" ").toLowerCase(),
      _time: ((r.prepMins ?? 0) + (r.cookMins ?? 0)) || undefined,
    })),
  [recipes]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = normalized.filter((r) => (q ? r._q.includes(q) : true));
    switch (sortBy) {
      case "title":
        list = list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "time":
        list = list.sort((a, b) => (a._time ?? 1e9) - (b._time ?? 1e9));
        break;
      case "recent":
      default:
        break;
    }
    return list;
  }, [normalized, query, sortBy]);

  return (
    <div className="flex flex-col gap-8">
      {/* Filter Bar */}
      <div className="sticky top-16 z-10 w-full bg-white/60 backdrop-blur-md border-b border-orange-200 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="flex-1 flex items-center gap-3">
            <label className="relative flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search recipes or tags…"
                className="w-full rounded-full border border-zinc-200 bg-white/90 px-4 py-2.5 pr-10 text-sm shadow-inner outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500"
              />
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </label>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-zinc-600">Sort</label>
            <select
              id="sort"
              className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOptionKey)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl w-full px-4">
        <div className="mb-3 text-sm text-zinc-600">
          Showing <strong>{visible.length}</strong> of {recipes.length} recipes
        </div>

        {/* Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" role="list">
          {visible.map((r) => (
            <li key={r.id}><RecipeCard recipe={r} /></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const minutes = ((recipe.prepMins ?? 0) + (recipe.cookMins ?? 0)) || undefined;
  const href = recipe.slug ? `/view/${recipe.slug}` : `/view/${recipe.id}`; // robust fallback

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow transition hover:shadow-lg hover:-translate-y-1 cursor-pointer">
      {/* Make the whole card clickable */}
      <Link href={href} aria-label={`Open ${recipe.title}`} className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50" />

      {/* Media */}
      <div className="relative aspect-[4/3] w-full bg-zinc-100">
        <SignedImage imageKey={recipe.imageKey} alt={recipe.title} />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-zinc-900">{recipe.title}</h3>
        {recipe.description && (
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{recipe.description}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-600">
          {minutes && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-orange-700 font-medium">⏱ {minutes} min</span>
          )}
          {recipe.servings && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-orange-700 font-medium">🍽 {recipe.servings} servings</span>
          )}
          {(recipe.tags ?? []).slice(0, 2).map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1">#{t}</span>
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
          onLoad={() => {/* natural load transitions */ }}
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
