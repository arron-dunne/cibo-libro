// lib/images.ts
// App-facing image helpers (validation, compression, display URL selection)
import { AllowedType, ALLOWED_TYPES, MAX_SIZE_BYTES } from "./constants";

// Compress an image to fit under the max size, using WebP or JPEG
export async function compressImageToTarget(
  file: File,
  opts: { maxBytes?: number; maxSide?: number } = {}
): Promise<Blob> {
  const maxBytes = opts.maxBytes ?? MAX_SIZE_BYTES;
  const maxSide  = opts.maxSide  ?? 2048;

  // Load as bitmap (faster than <img>)
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  const outW = Math.max(1, Math.round(bmp.width * scale));
  const outH = Math.max(1, Math.round(bmp.height * scale));

  const canvas = new OffscreenCanvas(outW, outH);
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.drawImage(bmp, 0, 0, outW, outH);

  // Try WebP first, fall back to JPEG if the browser can’t encode WebP
  const tryEncode = async (quality: number, contentType: AllowedType): Promise<Blob> => {
    const blob = await canvas.convertToBlob({ type: contentType, quality });
    return blob;
  };

  // Binary search quality to meet maxBytes
  let lo = 0.5, hi = 0.95, best: Blob | null = null;
  for (let i = 0; i < 7; i++) {
    const mid = (lo + hi) / 2;
    const blob = await tryEncode(mid, 'image/webp' as AllowedType);
    if (blob.size <= maxBytes) { best = blob; lo = mid; } else { hi = mid; }
  }

  if (!best || best.size > maxBytes) {
    // Fallback try JPEG with another quick pass
    lo = 0.5; hi = 0.95; best = null;
    for (let i = 0; i < 7; i++) {
      const mid = (lo + hi) / 2;
      const blob = await tryEncode(mid, 'image/jpeg' as AllowedType);
      if (blob.size <= maxBytes) { best = blob; lo = mid; } else { hi = mid; }
    }
  }

  if (!best || best.size > maxBytes) throw new Error('Could not compress under limit');
  return best;
}

// Utility: get a display URL for a recipe image
// export async function getRecipeDisplayUrl(recipe: { imageKey?: string | null; imageExternalUrl?: string | null }) {
//   if (recipe.imageKey) {
//     // Authorized path: generate a short-lived signed GET from R2
//     const { url } = await signDownload({ key: recipe.imageKey, ttlSeconds: 300 });
//     return url; // use <img src={url} />
//   }
//   if (recipe.imageExternalUrl) {
//     return recipe.imageExternalUrl; // hotlink for MVP
//   }
//   return null; // show placeholder
// }
