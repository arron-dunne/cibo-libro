// lib/r2.ts
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
  GetObjectCommand,
  _Object as S3Object,
} from '@aws-sdk/client-s3';
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
    case 'image/png':  return 'png';
    case 'image/webp': return 'webp';
    default: throw new Error('Unsupported content type');
  }
}

export function buildObjectKey(mime: string) {
  return `${randomUUID()}.${extFromMime(mime)}`;
}

export async function listObjects(opts?: {
  prefix?: string;
  maxKeys?: number;
  continuationToken?: string;
}) {
  const { prefix, maxKeys = 100, continuationToken } = opts ?? {};
  const out = await r2.send(new ListObjectsV2Command({
    Bucket: R2_BUCKET_NAME!,
    Prefix: prefix,
    MaxKeys: maxKeys,
    ContinuationToken: continuationToken,
  }));

  return {
    objects: (out.Contents ?? []).map(o => ({
      key: o.Key!,
      size: o.Size ?? 0,
      lastModified: o.LastModified?.toISOString() ?? null,
      etag: o.ETag ?? null,
    })),
    isTruncated: !!out.IsTruncated,
    nextContinuationToken: out.NextContinuationToken ?? null,
    prefix: prefix ?? null,
  };
}

export async function signDownload(input: { key: string; ttlSeconds?: number }) {
  const { key, ttlSeconds = 300 } = input;
  const cmd = new GetObjectCommand({ Bucket: R2_BUCKET_NAME!, Key: key });
  const url = await getSignedUrl(r2, cmd, { expiresIn: ttlSeconds });
  return url;
}

export async function deleteObject(key: string) {
  await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME!, Key: key }));
}

// (keep your presigned POST/PUT helpers here if you want)
