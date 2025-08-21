// app/api/images/sign-upload/route.ts
import "server-only";

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { signPut } from '@/lib/images/r2'; // the helper we made earlier
import { MAX_SIZE_BYTES, AllowedType, ALLOWED_TYPES } from "@/lib/images/constants";
// import { requireUser } from '@/lib/auth'; // TODO: your auth

const BodySchema = z.object({
  contentType: z.enum(ALLOWED_TYPES),
  size: z.number().int().positive().max(MAX_SIZE_BYTES),
});

export async function POST(req: Request) {
  try {
    // 1) Auth (server-side; don’t let anonymous users mint upload URLs)
    // const user = await requireUser(); // <- your implementation
    // const userId = user.id;
    const userId = 'demo'; // TODO: replace with real user id

    // 2) Validate input
    const body = await req.json();
    const { contentType, size } = BodySchema.parse(body);

    // 4) Sign a short-lived PUT URL
    const { url, key, expiresIn, requiredHeaders } = await signPut({ contentType: contentType as AllowedType });

    // 5) Return exactly what the client needs
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
    // // zod errors → 400; others → 500
    // const status = err instanceof z.ZodError ? 400 : 500;
    // const message =
    //   err instanceof z.ZodError ? z.treeifyError(err) : { error: err?.message ?? 'Server error' };
    // return NextResponse.json(message, { status });


    // 🔎 Log the true cause on the server (Vercel logs / terminal)
    console.error('sign-upload error:', {
      message: err?.message,
      stack: err?.stack,
      name: err?.name,
    });
    // Send a minimal error to the client
    return NextResponse.json({ error: 'Upload signing failed' }, { status: 500 });
  }
}
