// lib/images/r2.ts
import "server-only";

export const runtime = "nodejs";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ALLOWED_TYPES, AllowedType, DEFAULT_TTL_SECONDS } from "./constants";
import { randomUUID } from "crypto";

const {
  R2_ENDPOINT_URL,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
} = process.env;

if (
  !R2_ENDPOINT_URL ||
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  !R2_BUCKET_NAME
) {
  throw new Error(
    "Missing R2 env vars. Check R2_ENDPOINT_URL, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME",
  );
}

export const r2 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT_URL,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Utility: get extension from mime
export function extFromMime(mime: AllowedType) {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      throw new Error("Unsupported content type");
  }
}

export function buildObjectKey(userId: string, mime: AllowedType) {
  return `user/${userId}/${randomUUID()}.${extFromMime(mime)}`;
}

export async function signGet({
  key,
  expiresIn = 60,
}: {
  key: string;
  expiresIn?: number;
}) {
  const Bucket = process.env.R2_BUCKET_NAME!;
  if (!Bucket) throw new Error("R2_BUCKET_NAME missing");

  const cmd = new GetObjectCommand({
    Bucket,
    Key: key,
    // (optional) Force content-type/filename on response:
    // ResponseContentType: "image/webp",
    // ResponseContentDisposition: `inline; filename="cover.webp"`,
  });

  const url = await getSignedUrl(r2, cmd, { expiresIn });
  return { url, expiresIn, key };
}

/**
 * signPut — create a presigned PUT URL for direct browser upload to R2.
 * Returns the URL + key and the exact headers the client must send.
 */
export async function signPut(input: {
  userId: string;
  contentType: AllowedType;
}) {
  const { userId, contentType } = input;

  // Validate mime
  if (!ALLOWED_TYPES.includes(contentType)) {
    throw new Error(`Unsupported content type: ${contentType}`);
  }

  const key = buildObjectKey(userId, contentType);
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
    requiredHeaders: { "Content-Type": contentType },
  };
}

export async function deleteObject(key: string) {
  try {
    await r2.send(
      new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }),
    );
    return { ok: true };
  } catch (e: unknown) {
    if (e instanceof S3ServiceException) {
      const status = e.$metadata?.httpStatusCode ?? 500;
      if (status === 404) return { ok: true }; // idempotent delete
      return { ok: false, status };
    }
    return { ok: false, status: 500 };
  }
}

// (keep your presigned POST/PUT helpers here if you want)
