import { auth } from "@/lib/auth/auth";
import {
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

  const tagsData = await prisma.recipe.findMany({
    where: { ownerId: session?.user.id },
    select: { tags: true },
  });
  const allTags = [...new Set(tagsData.flatMap((r) => r.tags ?? []))];

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
            color="bg-linear-to-br from-blue-500 to-cyan-500 border-blue-800/40"
            header="View My Cookbook"
          />
          <ActionButton
            href="/add"
            Icon={PlusCircle}
            color="bg-linear-to-br from-red-500 to-pink-500 border-red-800/40"
            header="Create a New Recipe"
            />
          <ActionButton
            href="/import"
            Icon={Import}
            color="bg-linear-to-br from-green-500 to-lime-500 border-green-800/40"
            header="Import a Recipe"
          />
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="mt-10 rounded-3xl border border-white/70 bg-white/95 p-6 shadow-lg backdrop-blur-lg sm:p-8">
        <h2 className="text-2xl font-semibold text-orange-950 mb-3">
          What do you feel like today?
        </h2>
        <p className="text-slate-700 mb-5">
          Search your recipes or explore by tag.
        </p>

        {/* Search Bar */}
        <form action="/all" method="get" className="relative mb-6 max-w-lg">
          <input
            type="text"
            name="search"
            placeholder="Search for a recipe..."
            className="w-full rounded-full border border-orange-200 bg-white/80 py-3 pl-5 pr-12 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-300"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-orange-500 p-2 text-white shadow-md transition hover:scale-105 hover:bg-orange-600"
          >
            <Search />
          </button>
        </form>

        {/* Tag Cloud */}
        <div className="flex flex-wrap gap-3">
          {allTags.length > 0 ? (
            allTags.map((tag, i) => (
              <Link
                key={i}
                href={`/all?tags=${encodeURIComponent(tag)}`}
                className="group rounded-full border border-orange-200 bg-linear-to-br from-orange-50 to-orange-100/70 px-4 py-2 text-sm font-medium text-orange-950 shadow-sm transition hover:scale-105 hover:border-orange-400 hover:from-orange-100 hover:to-orange-200/80 hover:shadow-md"
              >
                <span className="group-hover:text-orange-600">{tag}</span>
              </Link>
            ))
          ) : (
            <p className="text-slate-500 italic">
              No tags yet — add some recipes to see them here!
            </p>
          )}
        </div>
      </section>

      {/* Recently Added */}
      <section className="mt-10">
        <h2
          className="mb-4 text-4xl font-extrabold text-white"
          style={{ WebkitTextStroke: "4px black", paintOrder: "stroke fill" }}
        >
          Recently Added
        </h2>
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
