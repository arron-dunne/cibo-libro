// app/api/images/sign-upload/route.ts
"use server";

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { signPut } from '@/lib/images/r2'; // the helper we made earlier
import { MAX_SIZE_BYTES, AllowedType, ALLOWED_TYPES } from "@/lib/images/constants";
// import { requireUser } from '@/lib/auth'; // TODO: your auth
import { auth } from "@/lib/auth";
const BodySchema = z.object({
  contentType: z.enum(ALLOWED_TYPES),
  size: z.number().int().positive().max(MAX_SIZE_BYTES),
});

export async function POST(req: Request) {
  try {
    // Auth (server-side; don’t let anonymous users mint upload URLs)
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;

    // Validate input
    const body = await req.json();
    const { contentType, size } = BodySchema.parse(body);

    // Sign a short-lived PUT URL
    const { url, key, expiresIn, requiredHeaders } = await signPut({ userId: userId, contentType: contentType as AllowedType });

    // Return exactly what the client needs
    return NextResponse.json(
      {
        method: 'PUT',
        url,
        key,
        expiresIn,
        requiredHeaders,      // e.g. { 'Content-Type': 'image/jpeg' }
        maxBytes: MAX_SIZE_BYTES,
      },
      { status: 200 },
    );
  } catch (err: any) {
    // zod errors → 400; others → 500
    const status = err instanceof z.ZodError ? 400 : 500;
    const message =
      err instanceof z.ZodError ? z.treeifyError(err) : { error: err?.message ?? 'Server error' };
    return NextResponse.json(message, { status });
  }
}
