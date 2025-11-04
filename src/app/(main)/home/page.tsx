import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CookingPot, Import, PlusCircle } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { RecipeCard, RecipeCardProps } from "@/app/components/recipes/RecipeCard";

export default async function HomePage() {

  const session = await auth();
  if (!session?.user) { redirect("/login"); }

  const recentRecipes = await prisma?.recipe.findMany({
    where: {ownerId: session?.user.id},
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