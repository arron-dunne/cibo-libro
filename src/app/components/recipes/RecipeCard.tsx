"use client";

import Link from "next/link";
import { RecipeImage } from "./RecipeImage";
import { Heart, LinkIcon } from "lucide-react";
import { Tag } from "../tags/Tags";

export type RecipeCardProps = {
  title: string; // required
  slug: string; // required
  description?: string;
  tags?: string[];
  prepMins?: number;
  cookMins?: number;
  servings?: number;
  sourceUrl?: string;
  imageKey?: string;
  imageExternalUrl?: string;
  isFavourite?: boolean;
};

export function RecipeCard({ recipe }: { recipe: RecipeCardProps }) {
  // const minutes = ((recipe.prepMins ?? 0) + (recipe.cookMins ?? 0)) || undefined;
  const href = `/view/${recipe.slug}`;

  return (
    <article className="relative w-full aspect-[0.7] flex flex-col overflow-hidden rounded-2xl border border-white/60 bg-white transition hover:scale-105 cursor-pointer">
      {/* Make whole card link */}
      <Link
        href={href}
        aria-label={`Open ${recipe.title}`}
        className="w-full h-full"
      >
        {recipe.isFavourite && (
          <div className="absolute top-4 left-4 rounded-full shrink-0 p-1.5 bg-white/70 border border-white/80">
            <Heart className="size-4 sm:size-6 lg:size-8 fill-rose-500 text-rose-600" />
          </div>
        )}
        {/* Picture */}
        <div className="w-full h-1/2 md:h-3/5 overflow-hidden bg-zinc-100">
          <RecipeImage
            imageKey={recipe.imageKey ?? null}
            externalUrl={recipe.imageExternalUrl ?? null}
            alt={recipe.title}
          />
        </div>

        {/* Content */}
        <div className="px-4 py-3 h-1/2 md:h-2/5 flex flex-col justify-between">
          <div>
            <h2 className="line-clamp-3 md:line-clamp-1 text-base md:text-xl font-bold text-zinc-900">
              {recipe.title}
            </h2>
            {recipe.description && (
              <div className="hidden md:block">
                <p className=" mt-1 line-clamp-2 overflow-hidden text-sm text-zinc-600">
                  {recipe.description}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 text-sm text-zinc-600">
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-scroll">
              {(recipe.tags ?? []).map((tag) => (
                <Tag key={tag} padding="py-1 px-2 md:px-4 md:py-2">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
