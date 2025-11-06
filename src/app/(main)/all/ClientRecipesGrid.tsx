"use client";

import React, { useMemo, useState } from "react";
import { RecipeCard, RecipeCardProps } from "@/app/components/recipes/RecipeCard";
import { Search, ChevronDown, Funnel, ArrowUpDown } from "lucide-react";


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
    <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
      {/* Filter Bar (floating pills) */}
      <div className="sticky top-0 z-10 flex items-center gap-3 md:gap-4">
        {/* Search bar */}
        <label className="relative flex-1">
          <input
            placeholder="Search recipes…"
            className="w-full h-11 md:h-12 rounded-full border border-white/70 bg-white backdrop-blur-md pl-10 pr-4 text-sm shadow-lg"
            aria-label="Search recipes"
          />
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange-600/80"
          />
        </label>

        {/* Sort */}
        <button
          type="button"
          className="sm:w-22 md:w-32 h-11 md:h-12 inline-flex items-center gap-1 rounded-full border border-white/70 px-4 text-sm font-semibold text-slate-700 bg-gradient-to-r from-slate-200 to-slate-300 shadow-lg cursor-pointer transition hover:brightness-90 active:scale-95"
        >
          <ArrowUpDown className="block sm:hidden" size={18} />
          <span className="hidden sm:block grow">Sort</span>
          <ChevronDown size={16} className="text-zinc-500" />
        </button>

        {/* Filter */}
        <button
          type="button"
          className="sm:w-22 md:w-32 h-11 md:h-12 inline-flex items-center gap-1 rounded-full border border-white/70 px-4 text-sm font-semibold text-slate-700 bg-gradient-to-r from-slate-200 to-slate-300 shadow-lg cursor-pointer transition hover:brightness-90 active:scale-95"
        >
          <Funnel className="block sm:hidden" size={18} />
          <span className="hidden sm:block grow">Filter</span>
          <ChevronDown size={16} className="text-zinc-500" />
        </button>
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
