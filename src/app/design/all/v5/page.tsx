"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Home,
  PlusCircle,
  Upload,
  Settings,
  LogOut,
  Search,
  ChevronDown,
  Image as ImageIcon,
} from "lucide-react";

// ──────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────
export default function AllRecipesPage() {
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const recipes = [
    {
      title: "Crispy Baked Tofu with Chili Oil",
      slug: "crispy-baked-tofu",
      description: "Saved as a Link Card. Visit the original for full details.",
      imageExternalUrl:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1471&auto=format&fit=crop",
      tags: ["Vegan", "Quick"],
    },
    {
      title: "Garlic Butter Shrimp Pasta",
      slug: "garlic-butter-shrimp-pasta",
      description: "A quick seafood dinner with lemon, garlic, and chili flakes.",
      imageExternalUrl:
        "https://images.unsplash.com/photo-1617196036517-7f3c7b2a8a63?q=80&w=1471&auto=format&fit=crop",
      tags: ["Dinner", "Seafood"],
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500 pb-20">
      <Navbar />

      {/* Floating Pills Bar */}
      <div className="sticky top-20 z-30 mx-auto w-[min(1150px,95%)] flex gap-3 justify-between md:justify-start items-cente rounded-full">
        {/* Search */}
        <label className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            placeholder="Search recipes..."
            className="w-full rounded-full border border-zinc-200 bg-white/80 pl-9 pr-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400"
          />
        </label>

        {/* Sort Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSort(!showSort);
              setShowFilter(false);
            }}
            className="flex items-center gap-1 rounded-full bg-white/80 border border-zinc-200 px-4 py-2 text-sm font-medium shadow-sm hover:bg-orange-50 transition"
          >
            Sort
            <ChevronDown size={16} className="text-zinc-500" />
          </button>

            {showSort && (
              <div
                className="absolute right-0 mt-2 w-44 rounded-xl border border-zinc-200 bg-white/95 shadow-lg overflow-hidden backdrop-blur"
              >
                {["Title A–Z", "Recently Added", "Total Time"].map((opt) => (
                  <button
                    key={opt}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-orange-50"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowFilter(!showFilter);
              setShowSort(false);
            }}
            className="flex items-center gap-1 rounded-full bg-white/80 border border-zinc-200 px-4 py-2 text-sm font-medium shadow-sm hover:bg-orange-50 transition"
          >
            Filter
            <ChevronDown size={16} className="text-zinc-500" />
          </button>

            {showFilter && (
              <div
                className="absolute right-0 mt-2 w-60 rounded-2xl border border-zinc-200 bg-white/95 shadow-lg p-3 backdrop-blur"
              >
                <p className="text-xs font-semibold text-zinc-500 mb-2">
                  Filter by:
                </p>
                <div className="flex flex-col gap-1 text-sm text-zinc-700">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-orange-500" /> Vegan
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-orange-500" /> Vegetarian
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-orange-500" /> Quick
                  </label>
                  <div className="border-t my-2" />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-orange-500" /> Imported Recipes
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-orange-500" /> Created by Me
                  </label>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Recipes Grid */}
      <main className="mx-auto w-[min(1150px,95%)] py-10 md:py-12">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {recipes.map((r, i) => (
            <li
              key={i}
            >
              <RecipeCard recipe={r} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

// ──────────────────────────────────────────────
// Navbar (original style)
// ──────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="sticky top-4 z-40 mx-auto w-[min(1150px,95%)] rounded-full border border-white/70 bg-white/60 backdrop-blur-xl shadow-lg px-4 sm:px-6 py-2 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/logo.png"
          alt="cibo libro"
          width={140}
          height={36}
          className="h-9 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
        />
      </Link>

      <div className="hidden sm:flex items-center gap-3">
        <NavButton icon={<Home size={15} />} label="Home" active />
        <NavButton icon={<PlusCircle size={15} />} label="Add" />
        <NavButton icon={<Upload size={15} />} label="Import" />
        <NavButton icon={<Settings size={15} />} label="Settings" />
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden sm:inline text-sm text-gray-700">demo@example.com</span>
        <button className="flex gap-2 items-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2 font-bold shadow hover:scale-105 transition">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
}

// ──────────────────────────────────────────────
// Recipe Card
// ──────────────────────────────────────────────
function RecipeCard({ recipe }: { recipe: any }) {
  const href = `/view/${recipe.slug}`;
  return (
    <Link href={href} aria-label={`Open ${recipe.title}`}>
      <article className="h-full flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 backdrop-blur-sm shadow-md transition hover:shadow-xl">
        <div className="relative h-48 w-full overflow-hidden">
          {recipe.imageExternalUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={recipe.imageExternalUrl}
              alt={recipe.title}
              className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-rose-100">
              <ImageIcon className="text-orange-400" size={32} />
              <p className="mt-2 text-xs font-medium text-zinc-500">No image available</p>
            </div>
          )}
        </div>

        <div className="flex flex-col p-3 h-full">
          <h2 className="line-clamp-1 text-base md:text-lg font-bold text-zinc-900">
            {recipe.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{recipe.description}</p>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {(recipe.tags ?? []).map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-100 to-rose-100 px-2 py-0.5 text-xs font-semibold text-orange-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}

// ──────────────────────────────────────────────
// Nav Button Helper
// ──────────────────────────────────────────────
function NavButton({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow"
          : "text-orange-700 hover:bg-orange-100/70"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
