// lib/r2.ts
import "server-only";

export const runtime = 'nodejs'

import { S3Client, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ALLOWED_TYPES, AllowedType, MAX_SIZE_BYTES, DEFAULT_TTL_SECONDS } from './constants';
import { randomUUID } from 'crypto';

const {
  R2_ENDPOINT_URL,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
} = process.env;

if (!R2_ENDPOINT_URL || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  throw new Error('Missing R2 env vars. Check R2_ENDPOINT_URL, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME');
}

export const r2 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT_URL,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Utility: get extension from mime
export function extFromMime(mime: AllowedType) {
  switch (mime) {
    case 'image/jpeg': return 'jpg';
    case 'image/png':  return 'png';
    case 'image/webp': return 'webp';
    default: throw new Error('Unsupported content type');
  }
}

export function buildObjectKey(mime: AllowedType) {
  return `${randomUUID()}.${extFromMime(mime)}`;
}


/**
 * signPut — create a presigned PUT URL for direct browser upload to R2.
 * Returns the URL + key and the exact headers the client must send.
 */
export async function signPut(input: {
  contentType: AllowedType;
}) {
  const { contentType } = input;

  // Validate mime
  if (!ALLOWED_TYPES.includes(contentType)) {
    throw new Error(`Unsupported content type: ${contentType}`);
  }

  const key = buildObjectKey(contentType);
  const expiresIn = DEFAULT_TTL_SECONDS; // seconds

  // Important: ContentType here MUST match the client's PUT header exactly.
  const cmd = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
    // (Optional) You can set CacheControl here if you plan to serve via CDN later:
    // CacheControl: 'public, max-age=31536000, immutable',
  });

  const url = await getSignedUrl(r2, cmd, { expiresIn });

  return {
    url,
    key,
    expiresIn,
    // Tell the client exactly what headers to send with the PUT:
    requiredHeaders: { 'Content-Type': contentType },
  };
}


// export async function signDownload(input: { key: string; ttlSeconds?: number }) {
//   const { key, ttlSeconds = 300 } = input;
//   const cmd = new GetObjectCommand({ Bucket: R2_BUCKET_NAME!, Key: key });
//   const url = await getSignedUrl(r2, cmd, { expiresIn: ttlSeconds });
//   return url;
// }

// export async function deleteObject(key: string) {
//   await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME!, Key: key }));
// }

// (keep your presigned POST/PUT helpers here if you want)
