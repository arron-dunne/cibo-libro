// lib/r2.ts
import { S3Client, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
} = process.env;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  throw new Error('Missing R2 env vars. Check R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME');
}

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// --- Config you can tweak for MVP ---
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export type AllowedType = typeof ALLOWED_TYPES[number];
export const MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3MB
export const DEFAULT_TTL_SECONDS = 300; // 5 minutes

// Utility: get extension from mime
export function extFromMime(mime: AllowedType) {
  switch (mime) {
    case 'image/jpeg': return 'jpg';
    case 'image/png': return 'png';
    case 'image/webp': return 'webp';
    default: throw new Error('Unsupported content type');
  }
}

// Utility: namespaced object key
export function buildObjectKey(params: { userId: string; recipeId: string; variant?: 'main' | 'thumb'; ext: string }) {
  const { userId, recipeId, variant = 'main', ext } = params;
  // Keep it deterministic but unique-per-replacement (timestamp). For strict immutability, swap for cuid().
  return `u_${userId}/r_${recipeId}/${variant}_${Date.now()}.${ext}`;
}

/**
 * Create a presigned POST so the browser can upload directly to R2.
 * Return shape matches what fetch+FormData expects on the client.
 */
export async function signUpload(input: {
  userId: string;
  recipeId: string;
  contentType: AllowedType;
  sizeBytes: number;
  variant?: 'main' | 'thumb';
  ttlSeconds?: number; // validity of the *upload form*
}) {
  const { userId, recipeId, contentType, sizeBytes, variant = 'main', ttlSeconds = DEFAULT_TTL_SECONDS } = input;

  if (!ALLOWED_TYPES.includes(contentType)) throw new Error('Invalid content type');
  if (sizeBytes > MAX_SIZE_BYTES) throw new Error('File too large');

  const key = buildObjectKey({ userId, recipeId, variant, ext: extFromMime(contentType) });

  const { url, fields } = await createPresignedPost(r2, {
    Bucket: R2_BUCKET_NAME!,
    Key: key,
    Conditions: [
      ['content-length-range', 0, MAX_SIZE_BYTES],
      ['starts-with', '$Content-Type', contentType],
    ],
    Fields: {
      'Content-Type': contentType,
      // If your bucket policy allows public reads later, you could include ACL here.
      // For MVP private bucket, omit ACL and keep objects private.
    },
    Expires: ttlSeconds,
  });

  return { url, fields, key };
}

/**
 * Create a time-limited signed GET URL to let the user view their private image.
 * Use this on the recipe page after verifying the user owns the recipe.
 */
export async function signDownload(input: {
  key: string;
  ttlSeconds?: number; // validity of the *download URL*
}) {
  const { key, ttlSeconds = DEFAULT_TTL_SECONDS } = input;
  const cmd = new GetObjectCommand({ Bucket: R2_BUCKET_NAME!, Key: key });
  const url = await getSignedUrl(r2, cmd, { expiresIn: ttlSeconds });
  return { url, key, expiresIn: ttlSeconds };
}

/** Delete an object (e.g., when a user replaces/removes a photo). */
export async function deleteObject(key: string) {
  await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME!, Key: key }));
}
