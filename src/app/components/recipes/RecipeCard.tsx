"use client";

import Link from "next/link";
import { RecipeImage } from "./RecipeImage";
import { getHostname } from "@/lib/hostname";
import { Heart, LinkIcon } from "lucide-react";

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
    <article className="relative w-full aspect-square lg:aspect-[0.7] flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg transition hover:scale-105 cursor-pointer">
      {/* Make whole card link */}
      <Link
        href={href}
        aria-label={`Open ${recipe.title}`}
        className="w-full h-full"
      >
        {/* Source URL */}
        {recipe.sourceUrl && (
          <Link
            href={recipe.sourceUrl}
            target="_blank"
            className="absolute top-3 right-3 px-2 py-1 flex gap-1 items-center
          bg-linear-to-br from-slate-200 to-slate-300 shadow
          rounded-full text-slate-700 border border-white/80
          cursor-pointer hover:brightness-90 active:brightness-75"
          >
            <LinkIcon size={16} />
            <p className="text-sm">{getHostname(recipe.sourceUrl)}</p>
          </Link>
        )}

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
            {recipe.title === "" ? (
              <h2 className="line-clamp-1 text-xl font-bold italic text-zinc-400">
                Untitled
              </h2>
            ) : (
              <h2 className="line-clamp-1 text-xl font-bold text-zinc-900">
                {recipe.title}
              </h2>
            )}
            {recipe.description && (
              <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                {recipe.description}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 text-sm text-zinc-600">
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
              {(recipe.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-linear-to-br from-orange-100 to-rose-100 text-rose-500 border border-rose-200 px-3 py-1 font-medium text-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
            {recipe.isFavourite && (
              <Heart
                size={24}
                className="shrink-0 fill-rose-500 text-rose-500"
              />
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
