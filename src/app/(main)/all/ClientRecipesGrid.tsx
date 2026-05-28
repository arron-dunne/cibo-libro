"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  RecipeCard,
  RecipeCardProps,
} from "@/app/components/recipes/RecipeCard";
import {
  Search,
  ChevronDown,
  Funnel,
  ArrowUpDown,
  FileQuestionMark,
} from "lucide-react";
import { SORT_OPTIONS, SortOptionKey } from "./options";
import { RecipeCardRecipe } from "./page";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/app/components/buttons/Buttons";

type ClientRecipesGridProps = {
  recipes: RecipeCardRecipe[];
  initialSort: SortOptionKey;
  initialSearch: string;
  initialTags?: string[];
};

export function ClientRecipesGrid({
  recipes,
  initialSort = "updated",
  initialSearch = "",
  initialTags = [],
}: ClientRecipesGridProps) {
  const [sortMenu, setSortMenu] = useState<boolean>(false);
  const [filterMenu, setFilterMenu] = useState<boolean>(false);

  const [sort, setSort] = useState<SortOptionKey>(initialSort);
  const [search, setSearch] = useState<string>(initialSearch);

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);

  // close dropdowns on click-outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (sortRef.current && !sortRef.current.contains(t)) setSortMenu(false);
      if (filterRef.current && !filterRef.current.contains(t))
        setFilterMenu(false);
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
        _query: [r.title, r.description, ...(r.tags ?? [])]
          .join(" ")
          .toLowerCase(),
        _time: (r.prepMins ?? 0) + (r.cookMins ?? 0) || undefined,
      })),
    [recipes],
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = normalized.filter((r) => {
      const matchesQuery = q ? r._query.includes(q) : true;
      const matchesTags = selectedTags.length
        ? (r.tags ?? []).some((t) => selectedTags.includes(t))
        : true;
      const matchesFavorites = favoritesOnly ? r.isFavourite : true;
      return matchesQuery && matchesTags && matchesFavorites;
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
        list = list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "updated":
        // newest to oldest
        list = list.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
        break;
      default:
        // Keep server order (assume updatedAt desc)
        break;
    }
    return list;
  }, [normalized, search, selectedTags, favoritesOnly, sort]);

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
  }

  // Reset the search input to empty
  function resetSearchInput() {
    if (searchRef.current) {
      searchRef.current.value = "";
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Filter Bar */}
      <div className="h-11 sm:h-12 flex items-center gap-2 md:gap-4">
        {/* Search bar */}
        <label className="relative h-full flex-1">
          <input
            ref={searchRef}
            placeholder="Search recipes…"
            className="w-full h-full rounded-full bg-white pl-12 pr-4 border border-slate-300"
            aria-label="Search recipes"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            size={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
        </label>

        {/* Sort */}
        <div ref={sortRef} className="h-full relative">
          <PrimaryButton
            aria-haspopup="menu"
            aria-expanded={sortMenu}
            width="sm:w-22 md:w-32"
            height="h-full"
            onClick={(e) => {
              e.stopPropagation();
              setSortMenu((s) => !s);
              setFilterMenu(false);
            }}
          >
            <ArrowUpDown className="block sm:hidden" size={18} />
            <span className="hidden sm:block grow">Sort</span>
            <ChevronDown className="hidden sm:block" size={22} />
          </PrimaryButton>

          {sortMenu && (
            <div
              key="sort-dd"
              className="absolute right-0 top-full mt-2 z-10 w-48 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl overflow-hidden"
              role="menu"
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  className="w-full h-10 p-2 bg-white text-start rounded-xl text-slate-800 cursor-pointer hover:brightness-95 active:brightness:90"
                  role="menuitem"
                  onClick={() => {
                    setSortMenu(false);
                    setSort(opt.key);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter */}
        <div ref={filterRef} className="h-full relative">
          <PrimaryButton
            // aria-haspopup="menu"
            // aria-expanded={filterMenu}
            width="sm:w-22 md:w-32"
            height="h-full"
            onClick={(e) => {
              e.stopPropagation();
              setFilterMenu((s) => !s);
              setSortMenu(false);
            }}
          >
            <Funnel className="block sm:hidden" size={18} />
            <span className="hidden sm:block grow">Filter</span>
            <ChevronDown className="hidden sm:block" size={22} />
          </PrimaryButton>

          {filterMenu && (
            <div
              key="filter-dd"
              className="absolute right-0 top-full max-h-96 mt-2 z-10 w-48 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl overflow-scroll"
              role="menu"
            >
              {/* Clear All button */}
              <SecondaryButton
                width="w-full"
                onClick={() => {
                  setSelectedTags([]);
                  setFavoritesOnly(false);
                }}
              >
                Clear All
              </SecondaryButton>
              {/* <p className="text-sm font-semibold text-zinc-500 mb-2">
                Filters
              </p> */}

              {/* Favorites filter */}
              <label className="ml-2 mt-4 flex items-center gap-2 text-base text-zinc-800">
                <input
                  type="checkbox"
                  checked={favoritesOnly}
                  onChange={(e) => setFavoritesOnly(e.target.checked)}
                />
                Favourites only
              </label>

              {/* Tag filters */}
              <p className="mt-3 text-sm font-semibold text-slate-500">Tags</p>
              <div className="mt-2 px-2 flex flex-col gap-1">
                {allTags.map((t) => (
                  <label key={t} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      // className="accent-orange-500"
                      checked={selectedTags.includes(t)}
                      onChange={(e) => toggleTag(t, e.target.checked)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty states */}
      {recipes.length === 0 && (
        <EmptyState
          title="No recipes yet"
          subtitle="Add your first recipe to see it here."
        />
      )}
      {recipes.length > 0 && visible.length === 0 && (
        <EmptyState
          title="No matches found"
          subtitle="Try a different search or clear your tag filters."
          actionLabel="Clear filters"
          onAction={() => {
            setSearch("");
            setSelectedTags([]);
            setFavoritesOnly(false);
            resetSearchInput();
          }}
        />
      )}

      {/* Grid */}
      <ul
        className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        role="list"
      >
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
    <div className="flex justify-center">
      <div className="my-12 w-max justify-self-center flex flex-col items-center justify-center rounded-3xl border border-white/40 bg-white/65 backdrop-blur py-10 px-20 text-center">
        <FileQuestionMark size={52} className="text-orange-700 mb-4" />
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="mt-4 max-w-md text-base text-slate-700">{subtitle}</p>
        )}
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
