"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

// Response validation
const SignedUrlResponse = z.object({
  url: z.string().url(),
});

type ClientImageProps = {
  imageKey?: string | null;
  externalUrl?: string | null; // NEW
  alt?: string;
};

export function ClientImage({ imageKey, externalUrl, alt }: ClientImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [status, setStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle");
  const [retry, setRetry] = useState(false);

  // Normalize external URLs (handle //cdn... and only allow http/https)
  const normalizedExternal = useMemo(() => normalizeUrl(externalUrl), [externalUrl]);

  useEffect(() => {
    let aborted = false;

    // If we have an imageKey, prefer signed URL flow
    const run = async (attempt = 1) => {
      if (!imageKey) return;
      try {
        setStatus("loading");
        // Use a relative URL so this works in all envs
        const res = await fetch("/api/images/sign-download", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ key: imageKey }),
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`Error fetching signed URL: ${res.status}`);

        const data = SignedUrlResponse.parse(await res.json());
        if (!aborted) {
          setImageSrc(data.url);
          setStatus("success");
        }
      } catch (err) {
        console.error(`Image fetch attempt ${attempt} failed:`, err);
        if (attempt === 1 && !retry) {
          setRetry(true);
          run(2);
        } else {
          setStatus("error");
        }
      }
    };

    // Signed flow only if imageKey exists
    if (imageKey) run();

    // Cleanup
    return () => {
      aborted = true;
    };
  }, [imageKey, retry]);

  // Loading state (only for signed flow)
  if (imageKey && status === "loading") {
    return <div className="h-full w-full animate-pulse rounded-3xl bg-white/50" />;
  }

  // If signed flow failed or not present, try external
  if ((!imageKey || status === "error") && normalizedExternal) {
    return (
      <img
        src={normalizedExternal}
        alt={alt || "Recipe image"}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => {
          // graceful fallback
          (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
        }}
      />
    );
  }

  // If we have a signed URL, render with Next/Image (optimized for your host)
  if (imageKey && imageSrc) {
    return (
      <Image
        src={imageSrc}
        alt={alt || "Recipe image"}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 60vw"
        className="object-cover"
        // If you haven't whitelisted your R2 host yet, temporarily enable:
        // unoptimized
      />
    );
  }

  // Final fallback
  return (
    <img
      src={PLACEHOLDER}
      alt={alt || "Recipe image"}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'><rect width='4' height='3' fill='#f3f4f6'/></svg>`
  );

function normalizeUrl(src?: string | null): string | null {
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
