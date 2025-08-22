// app/api/images/sign-upload/route.ts
"use server";

import { NextResponse } from "next/server";
import { z } from "zod";
import { signPut } from "@/lib/images/r2";
import { MAX_SIZE_BYTES, ALLOWED_TYPES, type AllowedType } from "@/lib/images/constants";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ---- Validation -------------------------------------------------------------
const BodySchema = z.object({
  contentType: z.enum(ALLOWED_TYPES),
  size: z.number().int().positive().max(MAX_SIZE_BYTES),
});

// Extra safety: keys must be under user/<userId>/...
const isUserScopedKey = (key: string, userId: string) =>
  key.startsWith(`user/${userId}/`) && !key.includes("..");

// ---- Handler ----------------------------------------------------------------
export async function POST(req: Request) {
  // Auth (server-side; anonymous users can't mint upload URLs)
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    // Validate input
    const body = await req.json();
    const { contentType, size } = BodySchema.parse(body);

    // Sign a short-lived PUT URL + generate a versioned, user-scoped key
    const { url, key, expiresIn, requiredHeaders } = await signPut({
      userId,
      contentType: contentType as AllowedType,
    });

    // Paranoia: ensure the signer actually produced a user-scoped key
    if (!isUserScopedKey(key, userId)) {
      return NextResponse.json({ error: "Unsafe key generated" }, { status: 500 });
    }

    // Persist issuance for provenance/authZ/GC
    const upload = await prisma.upload.create({
      data: {
        userId,
        key,
        size,
        contentType,
      },
      select: { id: true }, // "uploadId"
    });

    // Return exactly what the client needs
    return NextResponse.json(
      {
        method: "PUT",
        url,
        key,
        uploadId: upload.id,
        expiresIn,
        requiredHeaders, // e.g. { "Content-Type": "image/jpeg" }
        maxBytes: MAX_SIZE_BYTES,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: z.treeifyError(err) }, { status: 400 });
    }
    // Optional: handle Prisma unique errors gracefully if you ever reuse keys
    // if ((err as any)?.code === "P2002") { ... }

    return NextResponse.json({ error: (err as Error)?.message ?? "Server error" }, { status: 500 });
  }
}
