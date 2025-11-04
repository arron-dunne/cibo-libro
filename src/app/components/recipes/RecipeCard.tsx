"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
// import { Clock, Bowl } from "lucide-react";

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

  const minutes = ((recipe.prepMins ?? 0) + (recipe.cookMins ?? 0)) || undefined;
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
            imageKey={recipe.imageKey ?? null}
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
  imageKey,
  externalUrl,
  alt,
}: {
  imageKey?: string | null;
  externalUrl?: string | null;
  alt: string;
}) {


  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {

    async function run(imageKey: string) {
      const url = await getSignedImageUrl(imageKey)
      setSignedUrl(url)
    }

    if (imageKey) {
      run(imageKey);
    }

  }, [imageKey])


  const normalizedExternalUrl = externalUrl ? normalizeUrl(externalUrl) : null;


  // Show skeleton while trying to sign an R2 image
  // const showSkeleton = !!imageKey && (loading || (!url && !error));

  // If we have a signed R2 URL, use Next/Image (optimized for your host or unoptimized)
  if (signedUrl) {

    return (
      <Image
        src={signedUrl}
        alt={alt}
        fill
        className="w-full h-full object-cover object-center"
        unoptimized
        priority={false}
      />
    );
  }

  // No signed URL (no key or failed) → try external <img>
  else if (normalizedExternalUrl) {

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
    <Image
      src="/recipe-image-placeholder.png"
      alt="recipe image placeholder"
      fill={true}
    />
  );
}

async function getSignedImageUrl(key?: string): Promise<string | null> {

  if (!key) { return null; }

  try {
    const res = await fetch("/api/images/sign-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });

    if (!res.ok) { return null; }

    const data = await res.json();

    return data.url

  } catch {
    console.log("Failed to get signed image url")
    return null;
  }
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