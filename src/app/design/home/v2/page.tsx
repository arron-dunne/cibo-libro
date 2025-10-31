"use client";

import { useState } from "react";
import Image from "next/image";
import { LogOut, PlusCircle, Globe, BookOpen, Star, Search } from "lucide-react";

// ────────────────────────────────────────────────
// MOCK DATA
// ────────────────────────────────────────────────
const user = { name: "Arron" };

const recentRecipes = [
  { id: 1, title: "Creamy Mushroom Pasta", image: "https://images.unsplash.com/photo-1600803907087-f56d462fd26b?auto=format&fit=crop&q=80&w=927", tags: ["Dinner", "Vegetarian"] },
  { id: 2, title: "Avocado Toast Deluxe", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&q=80&w=1772", tags: ["Breakfast"] },
  { id: 3, title: "Lemon Chicken Skewers", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1772", tags: ["Lunch", "Grill"] },
  { id: 4, title: "Chocolate Lava Cake", image: "https://images.unsplash.com/photo-1589308078055-19aa94c0d9b8?auto=format&fit=crop&q=80&w=1772", tags: ["Dessert"] },
];

const recentlyCooked = [
  { id: 1, title: "Garlic Butter Shrimp", image: "https://images.unsplash.com/photo-1601315481208-6d4b937f7e6b?auto=format&fit=crop&q=80&w=1772", rated: false },
  { id: 2, title: "Penne alla Vodka", image: "https://images.unsplash.com/photo-1604908177522-40243d3b6a1b?auto=format&fit=crop&q=80&w=1772", rated: true, rating: 4 },
];

const popularTags = ["Dinner", "Chicken", "Baking", "Vegan", "Quick Meals", "Dessert", "Healthy", "Comfort Food"];

// ────────────────────────────────────────────────
// PAGE COMPONENT
// ────────────────────────────────────────────────
export default function Page() {
  const [active, setActive] = useState("home");

  return (
    <main className="relative mx-auto max-w-6xl px-4 py-8 text-orange-950">
      {/* ─────────────── NAVBAR ─────────────── */}
      <nav className="mb-10 flex flex-wrap items-center justify-between rounded-2xl bg-white/80 px-5 py-3 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="text-orange-600 text-2xl">🍊</span>
          <span className="text-orange-950">Cibo Libro</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          {["Home", "Library", "Add", "Import", "Cook Mode"].map((item) => (
            <button
              key={item}
              onClick={() => setActive(item.toLowerCase())}
              className={`transition-colors hover:text-orange-600 ${
                active === item.toLowerCase() ? "text-orange-600" : "text-orange-900/70"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600">
          <LogOut size={16} /> Logout
        </button>
      </nav>

      {/* ─────────────── HERO / QUICK LINKS ─────────────── */}
      <section className="rounded-3xl bg-white/90 p-8 shadow-lg backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold text-orange-950 sm:text-4xl">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="mt-2 text-orange-900/80">
          Let’s make something delicious today — or save a new recipe for later.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <ActionButton icon={<PlusCircle className="h-5 w-5" />} color="bg-orange-500 hover:bg-orange-600" label="Add Recipe" />
          <ActionButton icon={<Globe className="h-5 w-5" />} color="bg-emerald-500 hover:bg-emerald-600" label="Import Recipe" />
          <ActionButton icon={<BookOpen className="h-5 w-5" />} color="bg-sky-500 hover:bg-sky-600" label="Cook Mode" />
        </div>
      </section>

      {/* ─────────────── WHAT DO YOU FEEL LIKE TODAY ─────────────── */}
      <section className="mt-10 rounded-3xl bg-white/90 p-8 shadow-lg backdrop-blur-sm">
        <h2 className="text-2xl font-semibold text-orange-950">What do you feel like today?</h2>
        <p className="mt-2 text-orange-900/80">Search or browse by tags to find your next meal inspiration.</p>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-orange-500" />
            <input
              type="text"
              placeholder="Search recipes..."
              className="w-full rounded-full border border-orange-200 bg-orange-50 px-10 py-2.5 text-sm text-orange-950 placeholder-orange-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 transition hover:bg-orange-200"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* ─────────────── RECENTLY COOKED ─────────────── */}
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold text-orange-950">Recently Cooked</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recentlyCooked.map((recipe) => (
            <div
              key={recipe.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-lg"
            >
              <div className="relative h-44 w-full">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-orange-950">{recipe.title}</h3>
                  {!recipe.rated ? (
                    <p className="mt-1 text-sm text-orange-800/70 italic">
                      You haven’t rated this yet — how did it turn out?
                    </p>
                  ) : (
                    <div className="flex gap-1 mt-1 text-orange-500">
                      {[...Array(recipe.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                  )}
                </div>
                {!recipe.rated && (
                  <button className="rounded-full bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600">
                    Rate it
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────── RECENTLY ADDED ─────────────── */}
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold text-orange-950">Recently Added</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recentRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-lg"
            >
              <div className="relative h-44 w-full">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-orange-950">{recipe.title}</h3>
                <div className="mt-2 flex flex-wrap gap-1">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// ────────────────────────────────────────────────
// COMPONENT: ActionButton
// ────────────────────────────────────────────────
function ActionButton({
  icon,
  color,
  label,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
}) {
  return (
    <button
      className={`${color} flex items-center gap-2 rounded-full px-4 py-2 font-medium text-white shadow-md transition`}
    >
      {icon}
      {label}
    </button>
  );
}
