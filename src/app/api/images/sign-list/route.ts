// app/api/images/presign-list/route.ts
"use server";

import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/images/r2"; // your S3Client w/ endpoint=R2, region='auto', forcePathStyle

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const prefix = searchParams.get("prefix") ?? undefined;
  const maxKeys = Number(searchParams.get("max") ?? "50");

  // TODO: authz — ensure the caller is allowed to list this prefix
  const cmd = new ListObjectsV2Command({
    Bucket: "cibo-libro-images",
    Prefix: prefix,
    MaxKeys: maxKeys,
    // ContinuationToken: ...    // add if you want pagination
  });

  const url = await getSignedUrl(r2, cmd, { expiresIn: 60 }); // seconds
  return NextResponse.json({ url });
}
