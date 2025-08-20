// lib/r2.ts
import { S3Client, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { AllowedType, ALLOWED_TYPES, MAX_SIZE_BYTES, DEFAULT_TTL_SECONDS } from './constants';

const {
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_ENDPOINT_URL,
  R2_BUCKET_NAME,
} = process.env;

if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT_URL || !R2_BUCKET_NAME) {
  throw new Error('Missing R2 env vars. Check R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME');
}

export const r2 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT_URL,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Utility: extension from MIME
export function extFromMime(mime: AllowedType) {
  switch (mime) {
    case 'image/jpeg': return 'jpg';
    case 'image/png': return 'png';
    case 'image/webp': return 'webp';
    default: throw new Error('Unsupported content type');
  }
}

// Utility: generate a random object key
export function buildObjectKey(mime: AllowedType) {
  return `${randomUUID()}.${extFromMime(mime)}`;
}

/**
 * Create a presigned POST so the browser can upload directly to R2.
 */
export async function signUpload(input: {
  contentType: AllowedType;
  sizeBytes: number;
  ttlSeconds?: number;
}) {
  const { contentType, sizeBytes, ttlSeconds = DEFAULT_TTL_SECONDS } = input;

  if (!ALLOWED_TYPES.includes(contentType)) throw new Error('Invalid content type');
  if (sizeBytes > MAX_SIZE_BYTES) throw new Error('File too large');

  const key = buildObjectKey(contentType);

  const { url, fields } = await createPresignedPost(r2, {
    Bucket: R2_BUCKET_NAME!,
    Key: key,
    Conditions: [
      ['content-length-range', 0, MAX_SIZE_BYTES],
      ['starts-with', '$Content-Type', contentType],
    ],
    Fields: { 'Content-Type': contentType },
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

/**
 * Delete an object (e.g., when a user replaces/removes a photo).
 */
export async function deleteObject(key: string) {
  await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME!, Key: key }));
}
