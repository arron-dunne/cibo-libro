"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Image as ImageIcon, Home, LogOut } from "lucide-react";

export default function AllPage() {

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
      imageExternalUrl:
        "https://images.unsplash.com/photo-1617196036517-7f3c7b2a8a63?q=80&w=1471&auto=format&fit=crop",
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
      imageExternalUrl:
        "https://images.unsplash.com/photo-1587733083803-bd5ce070c6b3?q=80&w=1471&auto=format&fit=crop",
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
      imageExternalUrl:
        "https://images.unsplash.com/photo-1604908177522-04073c34a6d7?q=80&w=1471&auto=format&fit=crop",
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
      imageExternalUrl:
        "https://images.unsplash.com/photo-1601924582971-c9bbee9f3c89?q=80&w=1471&auto=format&fit=crop",
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
      imageExternalUrl:
        "https://images.unsplash.com/photo-1605475124754-9f8e4a8c41e0?q=80&w=1471&auto=format&fit=crop",
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
      imageExternalUrl:
        "https://images.unsplash.com/photo-1617196035232-44c7b44b14e7?q=80&w=1471&auto=format&fit=crop",
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
      imageExternalUrl:
        "https://images.unsplash.com/photo-1604908554049-77ae15d6c0bf?q=80&w=1471&auto=format&fit=crop",
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
      imageExternalUrl:
        "https://images.unsplash.com/photo-1589308078059-3786b0b8c3eb?q=80&w=1471&auto=format&fit=crop",
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
      imageExternalUrl:
        "https://images.unsplash.com/photo-1590080875831-a7e38d2e4e1f?q=80&w=1471&auto=format&fit=crop",
      tags: ["Salad", "Vegetarian"],
      prepMins: 10,
      cookMins: 0,
      servings: 2,
      sourceUrl: "https://www.loveandlemons.com/caprese-salad/",
    },
  ];


  return (
    <div>
      <Navbar/>
      <main className="z-0 mx-auto w-[min(1150px,95%)] py-8">
        <ClientRecipesGrid recipes={recipes} />
      </main >
    </div>
  );
}

function ClientRecipesGrid({ recipes }) {

  // Unique tags by frequency, then A→Z
  const allTags = ["Dinner", "Vegetarian", "One-Pot"]

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
                  placeholder="Search recipes, tags…"
                  className="w-full rounded-xl border border-zinc-200 bg-white/90 px-4 py-2.5 pr-10 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                  aria-label="Search recipes"
                />
              </label>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-zinc-600">
                  Sort
                </label>
                <select
                  id="sort"
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                >
                  <option value="title">Title A-Z</option>
                  <option value="rectn">Recently Added</option>
                  <option value="title">Total Time</option>
                </select>
              </div>

              {/* Count */}
              <div className="ml-auto text-sm text-zinc-600">
                Showing <strong>18</strong> of 67
              </div>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {allTags.map((tag) => {
                  return (
                    <button
                      key={tag}
                      className="whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6" role="list">
        {recipes.map((recipe, i) => (
          <li key={i}>
            <RecipeCard recipe={recipe} />
          </li>
        ))}
      </ul>
    </div>
  );
}


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

  const normalizedExternalUrl = externalUrl ? normalizeUrl(externalUrl) : null;

  // No signed URL (no key or failed) → try external <img>
  if (normalizedExternalUrl) {

    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={normalizedExternalUrl}
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

function normalizeUrl(src?: string): string | null {
  if (!src) return null;
  let s = src.trim();
  if (!s) return null;
  if (s.startsWith("//")) s = "https:" + s;
  try {
    const u = new URL(s);
    if (!/^https?:$/i.test(u.protocol)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

function Navbar() {

  return (
    <>
      {/* Floating navbar */}
      <nav className="sticky top-4 z-40" >
        <div className="mx-auto w-[min(1150px,95%)]">
          <div className="flex h-14 gap-2 rounded-full border border-white/80 bg-white/60 px-3 sm:px-4 py-2 shadow-sm backdrop-blur">

            {/* Logo */}
            <Link href="/" className="grow" aria-label="cibo libro home">
              <Image
                src="/images/logo.png"
                alt="cibo libro"
                width={150}
                height={36}
                className="h-9 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
                priority
              />
            </Link>

            {/* Navigation */}
            <div className="hidden gap-6 sm:flex">
              <button className="flex items-center gap-1 rounded-full transition bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2 font-bold shadow"><Home />Home</button>
              <button className="flex items-center gap-1 font-medium rounded-full transition text-orange-700 hover:brightness-200">Recipes</button>
              <button className="flex items-center gap-1 font-medium rounded-full transition text-orange-700 hover:brightness-200">Add</button>
              <button className="flex items-center gap-1 font-medium rounded-full transition text-orange-700 hover:brightness-200">Import</button>
              <button className="flex items-center gap-1 font-medium rounded-full transition text-orange-700 hover:brightness-200">Settings</button>
            </div>

            {/* Logout */}
            <div className="flex grow justify-end items-center gap-2 text-sm">
              <span className="hidden sm:inline text-gray-700">demo@example.com</span>
              <button className="flex gap-2 place-items-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2 font-bold shadow transition hover:scale-105 hover:brightness-95">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav >

      {/* Page container */}
  

      {/* <Footer /> */}
    </>
  );
}

