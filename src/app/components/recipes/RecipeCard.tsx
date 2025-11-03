"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
// import { Clock, Bowl } from "lucide-react";

export function RecipeCard({ recipe }: { recipe: Recipe }) {

  const minutes = ((recipe.prepMins ?? 0) + (recipe.cookMins ?? 0)) || undefined;
  const href = recipe.slug ? `/view/${recipe.slug}` : `/view/${recipe.id}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md cursor-pointer">
      {/* Make whole card clickable + accessible */}
      <Link
        href={href}
        aria-label={`Open ${recipe.title}`}
        className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
      />

      {/* Media */}
      <div className="relative aspect-[4/3] w-full bg-zinc-100">
        <RecipeImage
          imageKey={recipe.imageKey}
          externalUrl={recipe.imageExternalUrl}
          alt={recipe.title}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="line-clamp-1 text-lg font-semibold text-zinc-900 tracking-tight">{recipe.title}</h3>
        {recipe.description && (
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{recipe.description}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
          {minutes ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1">
              {/* <Clock className="h-3.5 w-3.5" /> */}
              {minutes} min
            </span>
          ) : null}
          {typeof recipe.servings === "number" && recipe.servings > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1">
              {/* <BowlIcon className="h-3.5 w-3.5" /> */}
              {recipe.servings} servings
            </span>
          ) : null}
          {(recipe.tags ?? []).slice(0, 3).map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 font-medium text-orange-700"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>
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
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
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
          className="absolute inset-0 h-full w-full object-cover"
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