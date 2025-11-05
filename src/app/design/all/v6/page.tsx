"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  Funnel,
} from "lucide-react";

// ──────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────
export default function AllRecipesPage() {
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

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

  // Mock data
  const recipes = [
    {
      title: "Crispy Baked Tofu with Chili Oil",
      slug: "crispy-baked-tofu",
      description: "Saved as a Link Card. Visit the original for full details.",
      imageExternalUrl:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1471&auto=format&fit=crop",
      tags: ["Vegan", "Quick"],
      prepMins: 10,
      cookMins: 25,
      servings: 2,
      sourceUrl: "https://cooking.nytimes.com/recipes/12345-crispy-tofu",
    },
    {
      title: "Garlic Butter Shrimp Pasta",
      slug: "garlic-butter-shrimp-pasta",
      description: "A quick seafood dinner with lemon, garlic, and chili flakes.",
      // imageExternalUrl:
      //   "https://images.unsplash.com/photo-1617196036517-7f3c7b2a8a63?q=80&w=1471&auto=format&fit=crop",
      tags: ["Dinner", "Seafood"],
      prepMins: 15,
      cookMins: 20,
      servings: 4,
      sourceUrl: "https://www.delish.com/garlic-butter-shrimp-pasta",
    },
    {
      title: "Fluffy Blueberry Pancakes",
      slug: "fluffy-blueberry-pancakes",
      description: "Perfect weekend breakfast — tall, soft, and full of berries.",
      // imageExternalUrl:
      //   "https://images.unsplash.com/photo-1587733083803-bd5ce070c6b3?q=80&w=1471&auto=format&fit=crop",
      tags: ["Breakfast", "Sweet"],
      prepMins: 10,
      cookMins: 15,
      servings: 3,
      sourceUrl: "https://sallysbakingaddiction.com/blueberry-pancakes/",
    },
    {
      title: "Creamy Mushroom Risotto",
      slug: "creamy-mushroom-risotto",
      description: "Classic Italian risotto with porcini mushrooms and parmesan.",
      imageExternalUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1471&auto=format&fit=crop",
      tags: ["Vegetarian", "Dinner"],
      prepMins: 15,
      cookMins: 35,
      servings: 2,
      sourceUrl: "https://www.bbcgoodfood.com/recipes/mushroom-risotto",
    },
    {
      title: "Roasted Veggie Buddha Bowl",
      slug: "roasted-veggie-buddha-bowl",
      description: "Colorful roasted vegetables with quinoa and tahini dressing.",
      imageExternalUrl:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1471&auto=format&fit=crop",
      tags: ["Vegan", "Healthy"],
      prepMins: 20,
      cookMins: 25,
      servings: 2,
      sourceUrl: "https://minimalistbaker.com/roasted-veggie-buddha-bowl/",
    },
    {
      title: "Spicy Ramen with Soft-Boiled Egg",
      slug: "spicy-ramen-egg",
      description: "Comforting ramen noodles in a rich, spicy miso broth.",
      // imageExternalUrl:
      //   "https://images.unsplash.com/photo-1604908177522-04073c34a6d7?q=80&w=1471&auto=format&fit=crop",
      tags: ["Asian", "Comfort Food"],
      prepMins: 10,
      cookMins: 15,
      servings: 1,
      sourceUrl: "https://www.seriouseats.com/spicy-ramen",
    },
    {
      title: "Classic Margherita Pizza",
      slug: "classic-margherita-pizza",
      description: "Thin crust pizza with tomato, mozzarella, and basil.",
      // imageExternalUrl:
      //   "https://images.unsplash.com/photo-1601924582971-c9bbee9f3c89?q=80&w=1471&auto=format&fit=crop",
      tags: ["Italian", "Vegetarian"],
      prepMins: 30,
      cookMins: 15,
      servings: 2,
      sourceUrl: "https://www.simplyrecipes.com/margherita-pizza-recipe-5180061",
    },
    {
      title: "Chicken Tikka Masala",
      slug: "chicken-tikka-masala",
      description: "Tender chicken in creamy spiced tomato sauce — a favorite classic.",
      // imageExternalUrl:
      //   "https://images.unsplash.com/photo-1605475124754-9f8e4a8c41e0?q=80&w=1471&auto=format&fit=crop",
      tags: ["Indian", "Spicy"],
      prepMins: 20,
      cookMins: 40,
      servings: 4,
      sourceUrl: "https://www.bonappetit.com/recipe/chicken-tikka-masala",
    },
    {
      title: "Beef Tacos with Fresh Salsa",
      slug: "beef-tacos-fresh-salsa",
      description: "Juicy tacos loaded with ground beef, lime crema, and salsa fresca.",
      // imageExternalUrl:
      //   "https://images.unsplash.com/photo-1617196035232-44c7b44b14e7?q=80&w=1471&auto=format&fit=crop",
      tags: ["Mexican", "Quick"],
      prepMins: 15,
      cookMins: 10,
      servings: 3,
      sourceUrl: "https://www.seriouseats.com/beef-tacos",
    },
    {
      title: "Avocado Toast with Poached Egg",
      slug: "avocado-toast-poached-egg",
      description: "A café-style breakfast that never gets old.",
      // imageExternalUrl:
      //   "https://images.unsplash.com/photo-1604908554049-77ae15d6c0bf?q=80&w=1471&auto=format&fit=crop",
      tags: ["Breakfast", "Healthy"],
      prepMins: 5,
      cookMins: 5,
      servings: 1,
      sourceUrl: "https://www.delish.com/avocado-toast-poached-egg",
    },
    {
      title: "Chocolate Lava Cake",
      slug: "chocolate-lava-cake",
      description: "Molten chocolate center with a crisp, rich outer shell.",
      // imageExternalUrl:
      //   "https://images.unsplash.com/photo-1589308078059-3786b0b8c3eb?q=80&w=1471&auto=format&fit=crop",
      tags: ["Dessert", "Sweet"],
      prepMins: 10,
      cookMins: 15,
      servings: 2,
      sourceUrl: "https://sallysbakingaddiction.com/molten-chocolate-lava-cakes/",
    },
    {
      title: "Caprese Salad with Balsamic Glaze",
      slug: "caprese-salad-balsamic-glaze",
      description: "Simple and fresh — tomato, mozzarella, basil, and balsamic drizzle.",
      // imageExternalUrl:
      //   "https://images.unsplash.com/photo-1590080875831-a7e38d2e4e1f?q=80&w=1471&auto=format&fit=crop",
      tags: ["Salad", "Vegetarian"],
      prepMins: 10,
      cookMins: 0,
      servings: 2,
      sourceUrl: "https://www.loveandlemons.com/caprese-salad/",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500">
      {/* Top navbar (original) */}
      <Navbar />

      {/* Floating pill row (no shared panel) */}
      <div className="sticky top-25 z-30">
        <div className="mx-auto w-[min(1150px,95%)] flex flex-wrap items-center gap-3 md:gap-4">
          {/* Search pill */}
          <label className="relative flex-1 min-w-[260px]">
            <input
              placeholder="Search recipes…"
              className="w-full h-11 md:h-12 rounded-full border border-white/70 bg-white backdrop-blur-md pl-10 pr-4 text-sm shadow-[0_6px_18px_rgba(0,0,0,0.10)] outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30"
              aria-label="Search recipes"
            />
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange-600/80"
            />
          </label>

          {/* Sort pill */}
          <div ref={sortRef} className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSort((s) => !s);
                setShowFilter(false);
              }}
              className="w-32 h-11 md:h-12 inline-flex items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-slate-700 bg-gradient-to-r from-slate-300/80 to-slate-400/80 shadow-lg backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-orange-400/60 transition"

              aria-haspopup="menu"
              aria-expanded={showSort}
            >
              <span className="grow">Sort</span>
              <ChevronDown size={16} className="text-zinc-500" />
            </button>

            <AnimatePresence>
              {showSort && (
                <motion.div
                  key="sort-dd"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 8, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute right-0 z-40 w-48 rounded-2xl border border-zinc-200 bg-white/95 shadow-xl overflow-hidden"
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter pill */}
          <div ref={filterRef} className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFilter((f) => !f);
                setShowSort(false);
              }}
              className="w-32 h-11 md:h-12 inline-flex items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-slate-700 bg-gradient-to-b from-slate-100 to-slate-300 shadow-[0_6px_16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4)] hover:from-slate-200 hover:to-slate-400 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-orange-400/60 transition"
              aria-haspopup="menu"
              aria-expanded={showFilter}
            >
              {/* <Funnel size={18} /> */}
              <span className="grow">Filter</span>
              <ChevronDown size={16} className="text-zinc-500" />
            </button>

            <AnimatePresence>
              {showFilter && (
                <motion.div
                  key="filter-dd"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 8, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute right-0 z-40 w-64 rounded-2xl border border-zinc-200 bg-white/95 shadow-xl p-3"
                  role="menu"
                >
                  <p className="text-xs font-semibold text-zinc-500 mb-2">Filter by</p>

                  <div className="mb-2">
                    <p className="text-xs font-semibold text-zinc-500 mb-1">Tags</p>
                    <div className="grid grid-cols-2 gap-1.5 text-sm text-zinc-800">
                      {["Vegan", "Vegetarian", "Quick", "Dinner", "Breakfast", "Seafood"].map(
                        (t) => (
                          <label key={t} className="flex items-center gap-2">
                            <input type="checkbox" className="accent-orange-500" /> {t}
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div className="border-t border-zinc-200 my-2" />

                  <div className="text-sm text-zinc-800">
                    <p className="text-xs font-semibold text-zinc-500 mb-1">Source</p>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-orange-500" /> Imported
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-orange-500" /> Created by me
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto w-[min(1150px,95%)] pt-8 md:pt-14 pb-16">
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
// Navbar (unchanged look)
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
          priority
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
// Card
// ──────────────────────────────────────────────
function RecipeCard({ recipe }) {

  const href = `/view/${recipe.slug}`

  return (
    <article className="w-full aspect-[0.7] flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg transition hover:scale-105 cursor-pointer">

      {/* Make whole card link */}
      <Link
        href={href}
        aria-label={`Open ${recipe.title}`}
        className="w-full h-full"
      >

        {/* Picture */}
        <div className="w-full h-2/3 overflow-hidden bg-zinc-100">
          <RecipeImage
            externalUrl={recipe.imageExternalUrl ?? null}
            alt={recipe.title}
          />
        </div>

        {/* Content */}
        <div className="p-3 h-full flex flex-col">
          <h2 className="line-clamp-1 text-xl font-bold text-zinc-900">{recipe.title}</h2>
          {recipe.description && (
            <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{recipe.description}</p>
          )}
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            {(recipe.tags ?? []).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 font-medium text-orange-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}

function RecipeImage({
  externalUrl,
  alt,
}: {
  externalUrl?: string | null;
  alt: string;
}) {

  // No signed URL (no key or failed) → try external <img>
  if (externalUrl) {

    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={externalUrl}
          alt={alt}
          className="w-full h-full object-cover object-center"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </>
    );
  }

  // Final placeholder
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-rose-100">
      <div className="text-orange-400">
        <ImageIcon size={32} />
      </div>
      <p className="mt-2 text-xs font-medium text-zinc-500">No image available</p>
    </div>
  );
}

// ──────────────────────────────────────────────
// Small helper
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
