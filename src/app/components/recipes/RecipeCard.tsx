"use client";

import Link from "next/link";
import { RecipeImage } from "./RecipeImage"

export type RecipeCardProps = {
  title: string,         // required
  slug: string,          // required
  description?: string,
  tags?: string[],
  prepMins?: number,
  cookMins?: number
  servings?: number,
  imageKey?: string,
  imageExternalUrl?: string
}

export function RecipeCard({ recipe }: { recipe: RecipeCardProps }) {

  // const minutes = ((recipe.prepMins ?? 0) + (recipe.cookMins ?? 0)) || undefined;
  const href = `/view/${recipe.slug}`

  return (
    <article className="w-full aspect-square lg:aspect-[0.7] flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg transition hover:scale-105 cursor-pointer">

      {/* Make whole card link */}
      <Link
        href={href}
        aria-label={`Open ${recipe.title}`}
        className="w-full h-full"
      >

        {/* Picture */}
        <div className="w-full h-3/5 overflow-hidden bg-zinc-100">
          <RecipeImage
            imageKey={recipe.imageKey ?? null}
            externalUrl={recipe.imageExternalUrl ?? null}
            alt={recipe.title}
          />
        </div>

        {/* Content */}
        <div className="px-4 py-3 h-2/5 flex flex-col justify-between">
          <div>
            {recipe.title === "" ?
              <h2 className="line-clamp-1 text-xl font-bold italic text-zinc-400">Untitled</h2> :
              <h2 className="line-clamp-1 text-xl font-bold text-zinc-900">{recipe.title}</h2>
            }
            {recipe.description && (
              <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{recipe.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            {(recipe.tags ?? []).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 font-medium text-orange-700 text-nowrap"
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