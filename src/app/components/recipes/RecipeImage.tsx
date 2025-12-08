"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import { Image as ImageIcon } from "lucide-react";

export function RecipeImage({
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
      <div className="relative w-full h-full">
        <Image
          src={signedUrl}
          alt={alt}
          fill={true}
          className="object-cover object-center"
          unoptimized
          priority={false}
        />
      </div>
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
    <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-orange-100 to-rose-100">
      <div className="text-orange-400">
        <ImageIcon size={32} />
      </div>
      <p className="mt-2 text-xs font-medium text-zinc-500">No image available</p>
    </div>
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
