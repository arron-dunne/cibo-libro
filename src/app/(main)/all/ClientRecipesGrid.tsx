"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { RecipeCard, RecipeCardProps } from "@/app/components/recipes/RecipeCard";
import { Search, ChevronDown, Funnel, ArrowUpDown } from "lucide-react";


export type ClientRecipesGridProps = {
  recipes: Recipe[];
  search?: string,
  sort?: string,
  initialQuery?: string;
  initialTags?: string[];
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
  sort="",
  initialQuery = "",
  initialTags = [],
  initialSort = "recent",
}: ClientRecipesGridProps) {

  const [showSort, setShowSort] = useState<boolean>(false)
  const [showFilter, setShowFilter] = useState<boolean>(false)

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // click-outside to close dropdowns
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (sortRef.current && !sortRef.current.contains(t)) setShowSort(false);
      if (filterRef.current && !filterRef.current.contains(t)) setShowFilter(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const [query, setQuery] = useState(initialQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [sortBy, setSortBy] = useState<SortOptionKey>(initialSort);

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
    <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
      {/* Filter Bar (floating pills) */}
      <div className="sticky top-19 z-10 flex items-center gap-3 md:gap-4">
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
        <div ref={sortRef} className="relative">
          <button
            type="button"
            className="sm:w-22 md:w-32 h-11 md:h-12 inline-flex items-center gap-1 rounded-full border border-white/70 px-4 text-sm font-semibold text-slate-700 bg-gradient-to-r from-slate-200 to-slate-300 shadow-lg cursor-pointer transition hover:brightness-90 active:scale-95"
            aria-haspopup="menu"
            aria-expanded={showSort}
            onClick={(e) => {
              e.stopPropagation();
              setShowSort((s) => !s);
              setShowFilter(false);
            }}
          >
            <ArrowUpDown className="block sm:hidden" size={18} />
            <span className="hidden sm:block grow">Sort</span>
            <ChevronDown size={16} className="text-zinc-500" />
          </button>

          {showSort && (
            <div
              key="sort-dd"
              className="absolute right-0 z-40 w-48 rounded-2xl border border-zinc-200 bg-white shadow-xl overflow-hidden"
              role="menu"
            >
              {["Title A–Z", "Recently Added", "Total Time"].map((opt) => (
                <button
                  key={opt}
                  className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-orange-50"
                  role="menuitem"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

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
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6" role="list">
        {visible.map((recipe, i) => (
          <li key={i}>
            <RecipeCard recipe={recipe as RecipeCardProps} />
          </li>
        ))}
      </ul>
    </div >
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
    </div>
  );
}
