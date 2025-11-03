"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RecipeCard } from "@/app/components/recipes/RecipeCard";

/**
 * ClientRecipesGrid — R2 + External-aware recipe grid (no expanding cards)
 * - Uses `imageKey` → POST /api/images/sign-download to get a signed URL (preferred)
 * - Falls back to `imageExternalUrl` (plain <img>, avoids Next allow-list)
 * - Equal-height cards, 1→4 responsive columns, glassy filter bar
 */

// export type Recipe = {
//   id: string;
//   slug?: string | null;               // /view/[slug]
//   title: string;
//   description?: string | null;
//   imageKey?: string | null;           // R2 object key
//   imageExternalUrl?: string | null;   // NEW: external image from importer
//   tags?: string[] | null;
//   prepMins?: number | null;
//   cookMins?: number | null;
//   servings?: number | null;
//   sourceUrl?: string | null;
// };

export type ClientRecipesGridProps = {
  recipes: Recipe[];
  initialQuery?: string;
  initialTags?: string[];
};

export function ClientRecipesGrid({
  recipes,
  initialSort = "updated",
  initialSearch = "",
  initialTags = []
}: ClientRecipesGridProps) {

  const [sortMenu, setSortMenu] = useState<boolean>(false)
  const [filterMenu, setFilterMenu] = useState<boolean>(false)

  const [sort, setSort] = useState<SortOptionKey>(initialSort)
  const [search, setSearch] = useState<string>(initialSearch);

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  // close dropdowns on click-outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (sortRef.current && !sortRef.current.contains(t)) setSortMenu(false);
      if (filterRef.current && !filterRef.current.contains(t)) setFilterMenu(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // Unique in alphabetical order
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const recipe of recipes) {
      for (const tag of recipe.tags ?? []) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [recipes]);

  // create query string for each recipe to eaily search through them
  const normalized = useMemo(
    () =>
      recipes.map((r) => ({
        ...r,
        _query: [r.title, r.description, ...(r.tags ?? [])].join(" ").toLowerCase(),
        _time: ((r.prepMins ?? 0) + (r.cookMins ?? 0)) || undefined,
      })),
    [recipes]
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = normalized.filter((r) => {
      const matchesQuery = q ? r._query.includes(q) : true;
      const matchesTags = selectedTags.length ? (r.tags ?? []).some((t) => selectedTags.includes(t)) : true;
      return matchesQuery && matchesTags;
    });
    switch (sort) {
      case "az":
        list = list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        list = list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "created":
        // newest to oldest
        list = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break;
      case "updated":
        // newest to oldest
        list = list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break;
      default:
        // Keep server order (assume updatedAt desc)
        break;
    }
    return list;
  }, [normalized, search, selectedTags, sort]);

  function toggleTag(tag: string, checked: boolean) {
    setSelectedTags((prev) => {
      if (checked) {
        // add the tag if it's checked and not already present
        return prev.includes(tag) ? prev : [...prev, tag];
      } else {
        // remove the tag if it's unchecked
        return prev.filter((t) => t !== tag);
      }
    });
  };

  // Reset the search input to empty
  function resetSearchInput() {
    if (searchRef.current) {
      searchRef.current.value = "";
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Filter Bar (floating pills) */}
      <div className="sticky top-20 z-5 flex items-center gap-3 md:gap-4">
        {/* Search bar */}
        <label className="relative flex-1">
          <input
            ref={searchRef}
            placeholder="Search recipes…"
            className="w-full h-11 md:h-12 rounded-full border border-white/70 bg-white backdrop-blur-md pl-10 pr-4 text-sm shadow-lg"
            aria-label="Search recipes"
            onChange={e => setSearch(e.target.value)}
          />
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange-600/80"
          />
        </label>

        {/* Sort */}
        <div ref={sortRef} className="relative">
          <button
            type="button"
            className="sm:w-22 md:w-32 h-11 md:h-12 inline-flex items-center gap-1 rounded-full border border-white/70 px-4 text-sm font-semibold text-slate-700 bg-gradient-to-r from-slate-200 to-slate-300 shadow-lg cursor-pointer transition hover:brightness-90 active:scale-95"
            aria-haspopup="menu"
            aria-expanded={sortMenu}
            onClick={(e) => {
              e.stopPropagation();
              setSortMenu((s) => !s);
              setFilterMenu(false);
            }}
          >
            <ArrowUpDown className="block sm:hidden" size={18} />
            <span className="hidden sm:block grow">Sort</span>
            <ChevronDown size={16} className="text-zinc-500" />
          </button>

          {sortMenu && (
            <div
              key="sort-dd"
              className="absolute right-0 z-6 w-48 rounded-2xl border border-zinc-200 bg-white shadow-xl overflow-hidden"
              role="menu"
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-orange-50"
                  role="menuitem"
                  onClick={() => setSort(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter */}
        <div ref={filterRef} className="relative">
          <button
            type="button"
            className="sm:w-22 md:w-32 h-11 md:h-12 inline-flex items-center gap-1 rounded-full border border-white/70 px-4 text-sm font-semibold text-slate-700 bg-gradient-to-r from-slate-200 to-slate-300 shadow-lg cursor-pointer transition hover:brightness-90 active:scale-95"
            aria-haspopup="menu"
            aria-expanded={filterMenu}
            onClick={(e) => {
              e.stopPropagation();
              setFilterMenu((s) => !s);
              setSortMenu(false);
            }}>
            <Funnel className="block sm:hidden" size={18} />
            <span className="hidden sm:block grow">Filter</span>
            <ChevronDown size={16} className="text-zinc-500" />
          </button>

          {filterMenu && (
            <div
              key="filter-dd"
              className="absolute right-0 z-6 w-64 rounded-2xl border border-zinc-200 bg-white shadow-xl p-3"
              role="menu"
            >
              <p className="text-xs font-semibold text-zinc-500 mb-2">Filter by</p>

              {/* Tag filters */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-zinc-500 mb-1">Tags</p>
                <div className="grid grid-cols-2 gap-1.5 text-sm text-zinc-800">
                  {allTags.map((t) => (
                    <label key={t} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-orange-500"
                        checked={selectedTags.includes(t)}
                        onChange={(e) => toggleTag(t, e.target.checked)}
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-zinc-200 my-2" />

              {/* Clear All button */}
              <button
                type="button"
                onClick={() => setSelectedTags([])}
                className="w-full rounded-full bg-orange-600 text-white text-sm font-semibold py-1.5 shadow hover:bg-orange-700 transition"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Empty states */}
      {recipes.length === 0 && (
        <EmptyState title="No recipes yet" subtitle="Add your first recipe to see it here." />
      )}
      {recipes.length > 0 && visible.length === 0 && (
        <EmptyState
          title="No matches found"
          subtitle="Try a different search or clear your tag filters."
          actionLabel="Clear filters"
          onAction={() => {
            setSearch("");
            setSelectedTags([]);
            resetSearchInput();
          }}
        />
      )}

      {/* Grid */}
      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6" role="list">
        {visible.map((recipe, i) => (
          <li key={i}>
            <RecipeCard recipe={recipe as RecipeCardProps} />
          </li>
        ))}
      </ul>
    </div >
  );
}

// function RecipeCard({ recipe }: { recipe: Recipe }) {
//   const minutes = ((recipe.prepMins ?? 0) + (recipe.cookMins ?? 0)) || undefined;
//   const href = recipe.slug ? `/view/${recipe.slug}` : `/view/${recipe.id}`;

//   return (
//     <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md cursor-pointer">
//       {/* Make whole card clickable + accessible */}
//       <Link
//         href={href}
//         aria-label={`Open ${recipe.title}`}
//         className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
//       />

//       {/* Media */}
//       <div className="relative aspect-[4/3] w-full bg-zinc-100">
//         <SignedImage
//           imageKey={recipe.imageKey}
//           externalUrl={recipe.imageExternalUrl}  // ← NEW
//           alt={recipe.title}
//         />
//       </div>

//       {/* Content */}
//       <div className="p-4 flex-1 flex flex-col">
//         <h3 className="line-clamp-1 text-lg font-semibold text-zinc-900 tracking-tight">{recipe.title}</h3>
//         {recipe.description && (
//           <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{recipe.description}</p>
//         )}
//         <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
//           {minutes ? (
//             <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1">
//               <ClockIcon className="h-3.5 w-3.5" />
//               {minutes} min
//             </span>
//           ) : null}
//           {typeof recipe.servings === "number" && recipe.servings > 0 ? (
//             <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1">
//               <BowlIcon className="h-3.5 w-3.5" />
//               {recipe.servings} servings
//             </span>
//           ) : null}
//           {(recipe.tags ?? []).slice(0, 3).map((t) => (
//             <span
//               key={t}
//               className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 font-medium text-orange-700"
//             >
//               #{t}
//             </span>
//           ))}
//         </div>
//       </div>
//     </article>
//   );
// }

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={normalizedExternal}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "recipe-image-placeholder.png";
          }}
        />
      </>
    );
  }

  // Final placeholder
  return (
    <Image
      src="/recipe-image-placeholder.png"
      alt="recipe image placeholder"
      fill={true}
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
    <div className="flex justify-center">
      <div className="my-12 w-max justify-self-center flex flex-col items-center justify-center rounded-3xl border border-white/40 bg-white/65 backdrop-blur py-10 px-20 text-center">
        <FileQuestionMark size={52} className="text-orange-700 mb-4" />
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-4 max-w-md text-base text-slate-700">{subtitle}</p>}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="mt-4 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700 cursor-pointer"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
