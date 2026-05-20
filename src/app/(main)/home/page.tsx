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
import { Header, SubHeader } from "@/app/components/text/Headers";
import { SecondaryButton } from "@/app/components/buttons/Buttons";

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
      <Header className="ml-1 mb-2 mt-8" >What&apos;s cooking?</Header>
      <SubHeader>Browse your cookbook, add new recipes, or import them so you never forget the food you love to cook.</SubHeader>
      
      {/* Main actions card */}
      <section className="w-full mt-4">
        <div className="mt-8 flex flex-wrap gap-4">
          <ActionButton
            href="/all"
            Icon={CookingPot}
            color="bg-linear-to-br from-blue-500 to-cyan-600"
            header="View My Cookbook"
          />
          <ActionButton
            href="/add"
            Icon={PlusCircle}
            color="bg-linear-to-br from-red-500 to-pink-600"
            header="Create a New Recipe"
          />
          <ActionButton
            href="/import"
            Icon={Import}
            color="bg-linear-to-br from-green-500 to-lime-600"
            header="Import a Recipe"
          />
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="mt-14 rounded-3xl border border-white/70 bg-white/95 p-6 shadow-lg backdrop-blur-lg sm:p-8">
        <Header textSize="text-3xl">What do you feel like today?</Header>
        {/* <SubHeader className="mt-2">Search for a recipe title or select a tag from you cookbook to jump in.</SubHeader> */}

        {/* Search Bar */}
        <form action="/all" method="get" className="flex gap-2 my-6">
          <input
            type="text"
            name="search"
            placeholder="Search your cookbook for a recipe title..."
            className="w-full max-w-lg rounded-full border border-slate-300 bg-white py-3 px-5 font-semibold"
          />
          <button
            type="submit"
            className="rounded-full h-12 w-12 flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 border border-slate-300 text-black hover:cursor-pointer hover:brightness-90 active:brightness-75"
          >
            <Search size={20} />
          </button>
        </form>

        {/* Tag Cloud */}
        <SubHeader className="ml-2 mb-4">Select a tag from your cookbook.</SubHeader>
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
          <Header className="ml-2" textSize="text-4xl">Recently Added</Header>
          <Link href="/all?sort=created">
            <SecondaryButton>
              View More <ChevronRight size={16} />
            </SecondaryButton>
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
      className={`${color} flex items-center gap-3 rounded-full px-6 py-4 text-lg font-bold text-white shadow-md border border-white/80 cursor-pointer transition hover:scale-110 active:scale-90`}
    >
      <Icon size={24} />
      {header}
    </Link>
  );
}
