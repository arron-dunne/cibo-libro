// app/api/images/finalize/route.ts
"use server";

import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Only allow user-scoped keys we generate; block traversal.
const SAFE_KEY_RE = /^user\/[a-zA-Z0-9_-]{10,}\/[a-f0-9-]{8,}\.(jpg|jpeg|png|webp)$/;

const Body = z.object({
  recipeId: z.string().min(1),
  newKey: z.string().min(3).max(512),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const { recipeId, newKey } = body;

  // Hygiene checks
  if (!SAFE_KEY_RE.test(newKey) || newKey.includes("..")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  // Verify recipe ownership & get current pointer
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: { id: true, ownerId: true, imageKey: true },
  });
  if (!recipe || recipe.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Verify the newKey was issued to this user (provenance)
  const issued = await prisma.upload.findUnique({ where: { key: newKey } });
  if (!issued || issued.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // If already attached, nothing to do
  if (recipe.imageKey === newKey) {
    return NextResponse.json({ imageKey: newKey }, { status: 200 });
  }

  const oldKey = recipe.imageKey;

  // Flip pointer in a txn (so read-your-write is consistent)
  await prisma.$transaction(async (tx) => {
    await tx.recipe.update({
      where: { id: recipeId },
      data: { imageKey: newKey },
    });
  });

  // Best-effort delete of the old object (ignore failures).
  // We do this *after* flipping the pointer to avoid losing both on error.
  try {
    if (oldKey) {
      // If you keep an R2 helper, prefer it here:
      // await deleteObject(oldKey)
      // Otherwise, if you don’t have a helper yet, you can add it to lib/images/r2
      const { deleteObject } = await import("@/lib/images/r2");
      await deleteObject(oldKey).catch(() => {});
    }
  } catch {
    // swallow
  }

  return NextResponse.json({ imageKey: newKey }, { status: 200 });
}
