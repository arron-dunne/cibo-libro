"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        sortRef.current &&
        !sortRef.current.contains(e.target as Node) &&
        filterRef.current &&
        !filterRef.current.contains(e.target as Node)
      ) {
        setShowSort(false);
        setShowFilter(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

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
    <div className="relative min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500">
      {/* Top navbar */}
      <Navbar />

      {/* Floating secondary control bar */}
      <div className="sticky top-24 z-30 flex justify-center">
        <motion.div
          layout
          className="flex flex-wrap items-center gap-3 md:gap-4 w-[min(1150px,95%)] rounded-full border border-white/70 bg-white/50 backdrop-blur-xl shadow-[0_6px_20px_rgba(0,0,0,0.05)] px-4 md:px-6 py-3 transition-all"
        >
          {/* Search pill */}
          <label className="relative flex-1 min-w-[240px]">
            <input
              placeholder="Search recipes, tags…"
              className="w-full rounded-full border border-zinc-200/60 bg-gradient-to-br from-white/90 to-white/70 pl-10 pr-4 py-2.5 text-sm shadow-inner placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-400/40 transition"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500/70"
            />
          </label>

          {/* Sort pill */}
          <div ref={sortRef} className="relative">
            <button
              onClick={() => {
                setShowSort(!showSort);
                setShowFilter(false);
              }}
              className="flex items-center gap-1.5 rounded-full border border-zinc-200/60 bg-gradient-to-br from-white/90 to-white/70 px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm hover:shadow-md hover:scale-[1.02] transition"
            >
              Sort
              <ChevronDown size={16} className="text-zinc-500" />
            </button>

            <AnimatePresence>
              {showSort && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute right-0 mt-3 w-44 rounded-2xl border border-zinc-200 bg-white/95 shadow-xl overflow-hidden backdrop-blur-sm"
                >
                  {["Title A–Z", "Recently Added", "Total Time"].map((opt) => (
                    <button
                      key={opt}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-orange-50 transition"
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter pill */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => {
                setShowFilter(!showFilter);
                setShowSort(false);
              }}
              className="flex items-center gap-1.5 rounded-full border border-zinc-200/60 bg-gradient-to-br from-white/90 to-white/70 px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm hover:shadow-md hover:scale-[1.02] transition"
            >
              Filter
              <ChevronDown size={16} className="text-zinc-500" />
            </button>

            <AnimatePresence>
              {showFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute right-0 mt-3 w-64 rounded-2xl border border-zinc-200 bg-white/95 shadow-xl p-3 backdrop-blur-sm"
                >
                  <p className="text-xs font-semibold text-zinc-500 mb-2">
                    Filter by:
                  </p>
                  <div className="flex flex-col gap-1.5 text-sm text-zinc-700">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-orange-500" /> Vegan
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-orange-500" /> Vegetarian
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-orange-500" /> Quick
                    </label>
                    <div className="border-t border-zinc-200 my-2" />
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-orange-500" /> Imported Recipes
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-orange-500" /> Created by Me
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Recipes Grid */}
      <main className="mx-auto w-[min(1150px,95%)] pt-14 md:pt-20 pb-16">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {recipes.map((r, i) => (
            <motion.li
              key={i}
              whileHover={{ scale: 1.03, y: -3 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              <RecipeCard recipe={r} />
            </motion.li>
          ))}
        </ul>
      </main>
    </div>
  );
}

// ──────────────────────────────────────────────
// Navbar
// ──────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="sticky top-4 z-40 mx-auto w-[min(1150px,95%)] rounded-full border border-white/80 bg-white/60 backdrop-blur-xl shadow-lg px-5 sm:px-7 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/logo.png"
          alt="cibo libro"
          width={150}
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
// Nav Button
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
