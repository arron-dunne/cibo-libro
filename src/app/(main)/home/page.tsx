import { auth } from "@/lib/auth/auth";
import { CookingPot, Import, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { RecipeCard, RecipeCardProps } from "@/app/components/recipes/RecipeCard";

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
    }
  })

  const tagsData = await prisma.recipe.findMany({
    where: { ownerId: session?.user.id },
    select: { tags: true },
  });
  const allTags = [...new Set(tagsData.flatMap(r => r.tags ?? []))];


  return (
    <>
      {/* Welcome card */}
      <section className="w-full mt-8 rounded-3xl border border-white/70 bg-white/95 p-6 shadow-lg backdrop-blur sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-950">
          What&apos;s cooking?
        </h1>
        <p className="mt-2 text-slate-700">
          Browse your cookbook — or add a new recipe for later.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <ActionButton
            href="/all"
            icon={<CookingPot className="h-5 w-5" />}
            color="bg-sky-500 hover:bg-sky-600"
            label="My Cookbook"
          />
          <ActionButton
            href="/new"
            icon={<PlusCircle className="h-5 w-5" />}
            color="bg-orange-500 hover:bg-orange-600"
            label="Add Recipe"
          />
          <ActionButton
            href="/import"
            icon={<Import className="h-5 w-5" />}
            color="bg-emerald-500 hover:bg-emerald-600"
            label="Import Recipe"
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
        <form
          action="/all"
          method="get"
          className="relative mb-6 max-w-lg"
        >
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
            <Search/>
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
        <h2 className="mb-4 text-2xl font-semibold text-orange-950">
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
  icon,
  color,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  color: string;
  label: string;
}) {
  return (
    <Link href={href} className={`${color} flex items-center gap-2 rounded-full px-4 py-2 font-medium text-white shadow-md transition cursor-pointer hover:scale-105`}>
      {icon}
      {label}
    </Link>
  );
}