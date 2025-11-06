"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Image as ImageIcon, Home, PlusCircle, Upload, Settings, LogOut } from "lucide-react";

export default function AllPage() {
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
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500" />
      <div
        aria-hidden
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/20 blur-3xl -z-10"
      />

      {/* Unified Glass Header */}
      <nav className="sticky top-4 z-40 flex justify-center">
        <div className="flex w-[min(1150px,95%)] flex-col gap-3 rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-xl p-4 md:p-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
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

            {/* Nav buttons */}
            <div className="hidden md:flex items-center gap-3">
              <NavButton icon={<Home size={16} />} label="Home" active />
              <NavButton icon={<PlusCircle size={16} />} label="Add" />
              <NavButton icon={<Upload size={16} />} label="Import" />
              <NavButton icon={<Settings size={16} />} label="Settings" />
            </div>

            {/* User + logout */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-zinc-700">demo@example.com</span>
              <button className="flex gap-2 items-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2 font-bold shadow transition hover:scale-105 hover:brightness-95">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {/* Search */}
            <label className="relative flex-1 min-w-[220px]">
              <input
                placeholder="Search recipes, tags…"
                className="w-full rounded-2xl border border-zinc-200/50 bg-white/90 px-4 py-2.5 pl-10 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
            </label>

            {/* Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <label htmlFor="sort" className="text-sm text-zinc-600">
                Sort
              </label>
              <select
                id="sort"
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              >
                <option value="title">Title A–Z</option>
                <option value="recent">Recently Added</option>
                <option value="time">Total Time</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1.5">
            {["Dinner", "Vegetarian", "Quick", "Breakfast"].map((tag) => (
              <button
                key={tag}
                className="whitespace-nowrap rounded-full border border-orange-200/60 bg-gradient-to-r from-orange-50 to-rose-50 px-3 py-1.5 text-sm font-medium text-orange-700 transition hover:bg-orange-100/70"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Recipes Grid */}
      <main className="mx-auto w-[min(1150px,95%)] py-10 md:py-12">
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
          role="list"
        >
          {recipes.map((recipe, i) => (
            <li
              key={i}
            >
              <RecipeCard recipe={recipe} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

function NavButton({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
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
