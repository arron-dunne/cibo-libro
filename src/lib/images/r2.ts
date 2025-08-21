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
import { randomUUID } from 'crypto';

const {
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_ENDPOINT_URL,      // e.g. https://<ACCOUNT_ID>.r2.cloudflarestorage.com
  R2_BUCKET_NAME,
} = process.env;

if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT_URL || !R2_BUCKET_NAME) {
  throw new Error(
    'Missing R2 env vars. Expected R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT_URL, R2_BUCKET_NAME'
  );
}

export const r2 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT_URL,
  forcePathStyle: true, // IMPORTANT for R2
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export function extFromMime(mime: string) {
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
