// app/view/[slug]/ClientImage.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { set } from "zod";

/*
  We fetch the image from R2 cloudflare bucket client side so we dont
  send large image data through vercel. We also need to hit the API route
  from the client to give it the cookie.
*/
export function ClientImage({ imageKey } : { imageKey: string | undefined }) {
    
    const [imageSrc, setImageSrc] = useState<string>("https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e?q=80&w=1471&auto=format&fit=crop");

    useEffect(() => {
          if (imageKey) {
          try {
            fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/images/sign-download`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ key: imageKey }),
              cache: "no-store",
            }).then(res => {
              if (!res.ok) {
                throw new Error(`Error with POST request: ${res.status}`);
              }
              return res.json();
            }).then(data => {
                const url : string = data.url;
                setImageSrc(url);
            })
          } catch (err) {
            console.error("Error fetching signed download URL:", err);
          }
        }

    })

    return (
        <Image
            src={imageSrc}
            alt="Recipe image"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover"
        />
    )

}