import { auth } from "@/lib/auth/auth";
import {
  ChevronRight,
  CookingPot,
  Import,
  LucideProps,
  PlusCircle,
  Search,
  Tag as TagIcon,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  RecipeCard,
  RecipeCardProps,
} from "@/app/components/recipes/RecipeCard";
import { Header, SubHeader } from "@/app/components/text/Headers";
import { PrimaryButton, SecondaryButton } from "@/app/components/buttons/Buttons";
import Image from "next/image";
import { Tag } from "@/app/components/tags/Tags";

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
      <div className="mt-12 ml-2 space-y-2">
        <Header>What&apos;s cooking?</Header>
        <SubHeader>Browse your cookbook, add new recipes, or import them so you never forget the food you love to cook.</SubHeader>
      </div>
      
      {/* Main actions card */}
      <section className="w-full mt-4">
        <div className="mt-8 flex flex-wrap gap-4">
          <ActionButton
            href="/all"
            Icon={CookingPot}
            color="bg-linear-to-br from-blue-300 to-blue-500"
            header="View My Cookbook"
          />
          <ActionButton
            href="/add"
            Icon={PlusCircle}
            color="bg-linear-to-br from-amber-400 to-orange-600"
            header="Create a New Recipe"
          />
          <ActionButton
            href="/import"
            Icon={Import}
            color="bg-linear-to-br from-lime-400 to-green-600"
            header="Import a Recipe"
          />
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="mt-14 rounded-3xl border border-white/50 bg-white p-6 sm:p-8">
        <Header textSize="text-3xl">What do you feel like today?</Header>
        
        {/* Search Bar */}
        <SubHeader className="mt-6 ml-2 mb-4">
          <Search size={24}/>
          Search your cookbook
        </SubHeader>
        <form action="/all" method="get" className="h-12 flex gap-2">
          <input
            type="text"
            name="search"
            placeholder="recipe title..."
            required
            className="w-full max-w-lg rounded-full border border-slate-300 bg-white px-5 font-semibold placeholder:text-slate-500"
          />
          <PrimaryButton type="submit" height="h-full">
            Search
            <ChevronRight size={20}/>
          </PrimaryButton>
        </form>

        {/* Tag Cloud */}
        <SubHeader className="mt-6 ml-2 mb-4">
          <TagIcon size={24}/>
          Filter by tags
        </SubHeader>
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {allTags.map((tag, i) => (
              <Link
                key={i}
                href={`/all?tags=${encodeURIComponent(tag)}`}
              >
                <Tag interactive={true}>
                  {tag}
                </Tag>
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
            <PrimaryButton>
              View More <ChevronRight size={16} />
            </PrimaryButton>
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
      className={`${color} flex items-center gap-3 rounded-full px-6 py-4 text-lg text-white font-bold shadow-md border border-white/60 cursor-pointer hover:brightness-95`}
    >
      <Icon size={24} />
      {header}
    </Link>
  );
}
