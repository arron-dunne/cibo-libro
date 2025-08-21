"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { z } from "zod";

// Response validation
const SignedUrlResponse = z.object({
  url: z.string().url(),
});

type ClientImageProps = {
  imageKey?: string;
  alt?: string;
};

export function ClientImage({ imageKey, alt }: ClientImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [retry, setRetry] = useState(false);

  useEffect(() => {
    if (!imageKey) return;

    let aborted = false;
    const fetchUrl = async (attempt = 1) => {
      try {
        setStatus("loading");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/images/sign-download`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ key: imageKey }),
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(`Error fetching signed URL: ${res.status}`);
        }

        const data = SignedUrlResponse.parse(await res.json());
        if (!aborted) {
          setImageSrc(data.url);
          setStatus("success");
        }
      } catch (err) {
        console.error(`Image fetch attempt ${attempt} failed:`, err);
        if (attempt === 1 && !retry) {
          // retry once
          setRetry(true);
          fetchUrl(2);
        } else {
          setStatus("error");
        }
      }
    };

    fetchUrl();

    return () => {
      aborted = true;
    };
  }, [imageKey, retry]);

  if (status === "loading") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white/50 animate-pulse">
        <span className="text-sm text-gray-600">Loading image…</span>
      </div>
    );
  }

  if (status === "error" || !imageSrc) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
        <span className="text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt || "Recipe image"}
      fill
      priority
      sizes="(max-width: 768px) 100vw, 60vw"
      className="object-cover"
    />
  );
}
