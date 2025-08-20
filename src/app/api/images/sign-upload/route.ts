export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { signUpload } from "@/lib/images/r2";
import { ALLOWED_TYPES, AllowedType, MAX_SIZE_BYTES } from "@/lib/images/constants";

export async function POST(req: NextRequest) {
  const { contentType, size } = (await req.json()) as { contentType?: string; size?: number };

  if (!contentType || !ALLOWED_TYPES.includes(contentType as AllowedType)) {
    return NextResponse.json({ error: "Unsupported type" }, { status: 400 });
  }
  if (!size || size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  const presigned = await signUpload({
    contentType: contentType as AllowedType,
    sizeBytes: size,
    ttlSeconds: 300,
  });

  // { url, fields, key }
  return NextResponse.json(presigned, { headers: { "Cache-Control": "no-store" } });
}
