"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * ClientRecipesGrid — R2 + External-aware recipe grid (no expanding cards)
 * - Uses `imageKey` → POST /api/images/sign-download to get a signed URL (preferred)
 * - Falls back to `imageExternalUrl` (plain <img>, avoids Next allow-list)
 * - Equal-height cards, 1→4 responsive columns, glassy filter bar
 */

export type Recipe = {
  id: string;
  slug?: string | null;               // /view/[slug]
  title: string;
  description?: string | null;
  imageKey?: string | null;           // R2 object key
  imageExternalUrl?: string | null;   // NEW: external image from importer
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

  // Unique tags by frequency, then A→Z
  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of recipes) for (const t of r.tags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0])).map(([t]) => t);
  }, [recipes]);

  const normalized = useMemo(
    () =>
      recipes.map((r) => ({
        ...r,
        _q: [r.title, r.description, ...(r.tags ?? [])].join(" ").toLowerCase(),
        _time: ((r.prepMins ?? 0) + (r.cookMins ?? 0)) || undefined,
      })),
    [recipes]
  );

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
        // Keep server order (assume updatedAt desc)
        break;
    }
    return list;
  }, [normalized, query, selectedTags, sortBy]);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  return (
    <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex flex-col gap-6">
      {/* Filter Bar (glassy card) */}
      <div className="sticky top-20 z-10">
        <div className="rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="p-3 md:p-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <label className="relative flex-1 min-w-[240px]">
                <span className="sr-only">Search recipes</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search recipes, tags…"
                  className="w-full rounded-xl border border-zinc-200 bg-white/90 px-4 py-2.5 pr-10 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                  aria-label="Search recipes"
                />
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </label>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-zinc-600">
                  Sort
                </label>
                <select
                  id="sort"
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOptionKey)}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Count */}
              <div className="ml-auto text-sm text-zinc-600">
                Showing <strong>{visible.length}</strong> of {recipes.length}
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
                        (active
                          ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm"
                          : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50")
                      }
                      aria-pressed={active}
                    >
                      {tag}
                    </button>
                  );
                })}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="ml-1 whitespace-nowrap rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Empty states */}
      {recipes.length === 0 && (
        <EmptyState title="No recipes yet" subtitle="Add your first recipe to see it here." />
      )}
      {recipes.length > 0 && visible.length === 0 && (
        <EmptyState
          title="No matches"
          subtitle="Try a different search or clear your tag filters."
          actionLabel="Clear filters"
          onAction={() => {
            setQuery("");
            setSelectedTags([]);
          }}
        />
      )}

      {/* Grid */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6" role="list">
        {visible.map((r) => (
          <li key={r.id}>
            <RecipeCard recipe={r} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const minutes = ((recipe.prepMins ?? 0) + (recipe.cookMins ?? 0)) || undefined;
  const href = recipe.slug ? `/view/${recipe.slug}` : `/view/${recipe.id}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md cursor-pointer">
      {/* Make whole card clickable + accessible */}
      <Link
        href={href}
        aria-label={`Open ${recipe.title}`}
        className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
      />

      {/* Media */}
      <div className="relative aspect-[4/3] w-full bg-zinc-100">
        <SignedImage
          imageKey={recipe.imageKey}
          externalUrl={recipe.imageExternalUrl}  // ← NEW
          alt={recipe.title}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="line-clamp-1 text-lg font-semibold text-zinc-900 tracking-tight">{recipe.title}</h3>
        {recipe.description && (
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{recipe.description}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
          {minutes ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1">
              <ClockIcon className="h-3.5 w-3.5" />
              {minutes} min
            </span>
          ) : null}
          {typeof recipe.servings === "number" && recipe.servings > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1">
              <BowlIcon className="h-3.5 w-3.5" />
              {recipe.servings} servings
            </span>
          ) : null}
          {(recipe.tags ?? []).slice(0, 3).map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 font-medium text-orange-700"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

/**
 * SignedImage — prefers R2 signed URL via /api/images/sign-download.
 * Falls back to external image URL if no key or signing fails.
 * - Plain <img> for external (bypasses Next allow-list)
 * - Skeleton + placeholder for nice loading
 */

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
          let message = `sign-download failed (${res.status})`;
          try {
            const j = await res.json();
            message = j?.error || j?.message || message;
          } catch {
            /* ignore */
          }
          throw new Error(message);
        }

        const data = await res.json();
        const signed: string | undefined =
          data?.url ?? data?.signedUrl ?? data?.signed_url;

        if (key && signed) {
          signedUrlCache.set(key, signed);
          setUrl(signed);
          setLoading(false);
        } else {
          throw new Error("No signed URL in response");
        }
      } catch (e: unknown) {
        if (controller.signal.aborted) return;
        const message = e instanceof Error ? e.message : "Failed to obtain signed URL";
        setError(message);
        setUrl(null);
        setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [key]);

  return { url, loading, error } as const;
}

function SignedImage({
  imageKey,
  externalUrl,
  alt,
}: {
  imageKey?: string | null;
  externalUrl?: string | null;
  alt: string;
}) {
  const { url, loading, error } = useSignedImageUrl(imageKey);
  const normalizedExternal = normalizeUrl(externalUrl);

  // Show skeleton while trying to sign an R2 image
  const showSkeleton = !!imageKey && (loading || (!url && !error));

  // If we have a signed R2 URL, use Next/Image (optimized for your host or unoptimized)
  if (url) {
    return (
      <>
        {showSkeleton && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-200 to-zinc-100" aria-hidden />
        )}
        <Image
          src={url}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          unoptimized
          priority={false}
        />
      </>
    );
  }

  // No signed URL (no key or failed) → try external <img>
  if (normalizedExternal) {
    return (
      <>
        {showSkeleton && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-200 to-zinc-100" aria-hidden />
        )}
        <img
          src={normalizedExternal}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
          }}
        />
      </>
    );
  }

  // Final placeholder
  return (
    <img
      src={PLACEHOLDER}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

function normalizeUrl(src?: string | null): string | null {
  if (!src) return null;
  let s = src.trim();
  if (!s) return null;
  if (s.startsWith("//")) s = "https:" + s;
  try {
    const u = new URL(s);
    if (!/^https?:$/i.test(u.protocol)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

function EmptyState({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="my-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
      <div className="mb-2 rounded-full bg-white p-3 shadow-sm">
        <BookIcon className="h-6 w-6 text-zinc-500" />
      </div>
      <h4 className="text-lg font-semibold text-zinc-900">{title}</h4>
      {subtitle && <p className="mt-1 max-w-md text-sm text-zinc-600">{subtitle}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/** Tiny icons (no deps) */
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
