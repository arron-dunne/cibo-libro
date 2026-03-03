import { auth } from "@/lib/auth/auth";
import {
  ChevronRight,
  CookingPot,
  Import,
  LucideProps,
  PlusCircle,
  Search,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  RecipeCard,
  RecipeCardProps,
} from "@/app/components/recipes/RecipeCard";

export default async function HomePage() {
  const session = await auth();

  const recentRecipes = await prisma?.recipe.findMany({
    where: { ownerId: session?.user.id },
    orderBy: { createdAt: "desc" },
    take: 4,
    select: {
      title: true,
      description: true,
      tags: true,
      slug: true,
      imageKey: true,
      imageExternalUrl: true,
    },
  });

  const allTags = (
    await prisma.$queryRaw<{ tag: string }[]>`
    SELECT tag FROM "Recipe", unnest(tags) AS tag
    WHERE "ownerId" = ${session?.user.id}
    GROUP BY tag ORDER BY COUNT(*) DESC LIMIT 10
  `
  ).map((r) => r.tag);

  return (
    <>
      {/* Header */}
      <h1
        className="mt-8 ml-4 text-5xl text-white font-black"
        style={{ WebkitTextStroke: "5px black", paintOrder: "stroke fill" }}
      >
        What&apos;s cooking?
      </h1>
      {/* Main actions card */}
      <section className="w-full mt-4 rounded-3xl border border-white/70 bg-white/95 p-6 shadow-lg backdrop-blur sm:p-8">
        <p className="text-lg font-semibold">
          Browse your cookbook, add new recipes, or import them so you never
          forget the food you love to cook.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <ActionButton
            href="/all"
            Icon={CookingPot}
            color="bg-linear-to-br from-blue-500 to-cyan-600 border-blue-800/40"
            header="View My Cookbook"
          />
          <ActionButton
            href="/add"
            Icon={PlusCircle}
            color="bg-linear-to-br from-red-500 to-pink-600 border-red-800/40"
            header="Create a New Recipe"
          />
          <ActionButton
            href="/import"
            Icon={Import}
            color="bg-linear-to-br from-green-500 to-lime-600 border-green-800/40"
            header="Import a Recipe"
          />
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="mt-10 rounded-3xl border border-white/70 bg-white/95 p-6 shadow-lg backdrop-blur-lg sm:p-8">
        <h2 className="text-2xl font-semibold mb-1">
          What do you feel like today?
        </h2>
        <p className="text-slate-500 mb-4">Search for a recipe or jump straight to a tag.</p>

        {/* Search Bar */}
        <form action="/all" method="get" className="flex gap-2 mb-6">
          <input
            type="text"
            name="search"
            placeholder="Search for a recipe..."
            className="w-full max-w-lg rounded-full border border-slate-300 bg-white py-3 px-5"
          />
          <button
            type="submit"
            className="rounded-full h-12 w-12 flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 border border-slate-300 text-black hover:cursor-pointer hover:brightness-90 active:brightness-75"
          >
            <Search size={20} />
          </button>
        </form>

        {/* Tag Cloud */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {allTags.map((tag, i) => (
              <Link
                key={i}
                href={`/all?tags=${encodeURIComponent(tag)}`}
                className="inline-flex items-center rounded-full bg-linear-to-br from-orange-100 to-rose-100 text-rose-500 border border-rose-200 px-4 py-2 font-semibold text-nowrap shadow-sm hover:brightness-95 hover:shadow-md transition"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recently Added */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-4xl font-extrabold text-white tracking-wide"
            style={{ WebkitTextStroke: "4px black", paintOrder: "stroke fill" }}
          >
            Recently Added
          </h2>
          <Link
            href="/all?sort=created"
            className="inline-flex items-center gap-1 rounded-full bg-linear-to-br from-slate-200 to-slate-300 border border-white/40 px-4 py-2 text-sm font-semibold text-slate-700 shadow hover:brightness-90 active:brightness-75"
          >
            View More <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recentRecipes.map((recipe, i) => (
            <RecipeCard key={i} recipe={recipe as RecipeCardProps} />
          ))}
        </div>
      </section>
    </>
  );
}

function ActionButton({
  href,
  color,
  Icon,
  header,
}: {
  href: string;
  color: string;
  Icon: React.ComponentType<LucideProps>;
  header: string;
}) {
  return (
    <Link
      href={href}
      className={`${color} flex items-center gap-3 rounded-full px-6 py-4 text-lg font-bold text-white shadow-md transition border cursor-pointer hover:scale-105`}
    >
      <Icon size={24} />
      {header}
    </Link>
  );
}
