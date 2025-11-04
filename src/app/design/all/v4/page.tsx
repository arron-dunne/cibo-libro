"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Home,
  PlusCircle,
  Upload,
  Settings,
  LogOut,
  Image as ImageIcon,
  X,
} from "lucide-react";

// ──────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────
export default function AllRecipesPage() {
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
    {
      title: "Fluffy Blueberry Pancakes",
      slug: "fluffy-blueberry-pancakes",
      description: "Perfect weekend breakfast — tall, soft, and full of berries.",
      imageExternalUrl:
        "https://images.unsplash.com/photo-1587733083803-bd5ce070c6b3?q=80&w=1471&auto=format&fit=crop",
      tags: ["Breakfast", "Sweet"],
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500">
      <Navbar
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {/* Filter overlay panel */}
      <AnimatePresence>
        {showFilters && <FilterPanel onClose={() => setShowFilters(false)} />}
      </AnimatePresence>

      {/* Grid */}
      <main className="mx-auto w-[min(1150px,95%)] py-10 md:py-12">
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
function Navbar({
  showSearch,
  setShowSearch,
  showFilters,
  setShowFilters,
}: {
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
}) {
  return (
    <motion.nav
      layout
      className="sticky top-4 z-40 mx-auto w-[min(1150px,95%)] rounded-full border border-white/60 bg-white/50 backdrop-blur-xl shadow-lg px-4 py-2 md:px-6 flex items-center justify-between"
    >
      {/* Left: logo + nav */}
      <div className="flex items-center gap-3 md:gap-5">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="cibo libro"
            width={130}
            height={32}
            className="h-8 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
          />
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <NavButton icon={<Home size={15} />} label="Home" active />
          <NavButton icon={<PlusCircle size={15} />} label="Add" />
          <NavButton icon={<Upload size={15} />} label="Import" />
          <NavButton icon={<Settings size={15} />} label="Settings" />
        </div>
      </div>

      {/* Center: expanding search */}
      <AnimatePresence initial={false}>
        {showSearch && (
          <motion.div
            key="search"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "40%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="hidden md:flex relative items-center"
          >
            <input
              type="text"
              placeholder="Search recipes..."
              className="w-full rounded-full border border-zinc-200 bg-white/90 pl-9 pr-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-400/40"
              autoFocus
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right: icons + logout */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-2 rounded-full hover:bg-white/40 transition"
          aria-label="Toggle search"
        >
          {showSearch ? <X size={18} /> : <Search size={18} />}
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-full transition ${
            showFilters ? "bg-orange-500 text-white" : "hover:bg-white/40"
          }`}
          aria-label="Toggle filters"
        >
          <Filter size={18} />
        </button>
        <span className="hidden sm:inline text-sm text-gray-700">
          demo@example.com
        </span>
        <button className="flex gap-2 items-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2 font-bold shadow hover:scale-105 transition">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </motion.nav>
  );
}

// ──────────────────────────────────────────────
// Filter panel (overlay below navbar)
// ──────────────────────────────────────────────
function FilterPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      key="filters"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="sticky top-20 z-30 mx-auto w-[min(1150px,95%)]"
    >
      <div className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-md p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
            {["Dinner", "Vegetarian", "Quick", "Breakfast", "Healthy"].map(
              (tag) => (
                <button
                  key={tag}
                  className="whitespace-nowrap rounded-full border border-orange-200/70 bg-gradient-to-r from-orange-50 to-rose-50 px-3 py-1.5 text-sm font-medium text-orange-700 hover:bg-orange-100/80 transition"
                >
                  {tag}
                </button>
              )
            )}
          </div>

          {/* Sort dropdown */}
          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-zinc-600">
              Sort
            </label>
            <select
              id="sort"
              className="rounded-xl border border-zinc-200 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400"
            >
              <option value="title">Title A–Z</option>
              <option value="recent">Recently Added</option>
              <option value="time">Total Time</option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
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
              <p className="mt-2 text-xs font-medium text-zinc-500">
                No image available
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col p-3 h-full">
          <h2 className="line-clamp-1 text-base md:text-lg font-bold text-zinc-900">
            {recipe.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
            {recipe.description}
          </p>
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
// Helpers
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
