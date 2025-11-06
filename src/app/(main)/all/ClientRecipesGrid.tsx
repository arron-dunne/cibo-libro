"use client";

import React, { useMemo, useState } from "react";
import { RecipeCard, RecipeCardProps } from "@/app/components/recipes/RecipeCard";


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

export function ClientRecipesGrid({
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
        {visible.map((recipe, i) => (
          <li key={i}>
            <RecipeCard recipe={recipe as RecipeCardProps} />
          </li>
        ))}
      </ul>
    </div>
  );
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
        {/* <BookIcon className="h-6 w-6 text-zinc-500" /> */}
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
