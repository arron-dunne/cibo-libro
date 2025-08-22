// app/api/images/delete/route.ts
"use server";

import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Only allow user-scoped keys we generate; block traversal.
const SAFE_KEY_RE = /^user\/[a-zA-Z0-9_-]{10,}\/[a-f0-9-]{8,}\.(jpg|jpeg|png|webp)$/;

const Body = z.object({
  key: z.string().min(3).max(512),
  recipeId: z.string().min(1).optional(),
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

  const { key, recipeId } = body;

  // Hygiene
  if (!SAFE_KEY_RE.test(key) || key.includes("..")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  // Attached delete path (requires recipeId)
  if (recipeId) {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { ownerId: true, imageKey: true },
    });
    if (!recipe || recipe.ownerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (recipe.imageKey !== key) {
      // Don’t leak whether key exists anywhere else
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Flip pointer to null first; then best-effort delete the object.
    await prisma.recipe.update({
      where: { id: recipeId },
      data: { imageKey: null },
      select: { id: true },
    });

    try {
      const { deleteObject } = await import("@/lib/images/r2");
      await deleteObject(key).catch(() => {});
    } catch {
      // ignore; idempotent
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Unattached (pending) delete path — must belong to user and not be attached
  const issued = await prisma.upload.findUnique({ where: { key } });
  if (!issued || issued.userId !== userId) {
    // Hide existence
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Ensure no recipe currently points at this key (paranoia)
  const ref = await prisma.recipe.findFirst({
    where: { imageKey: key },
    select: { id: true },
  });
  if (ref) {
    // If it became attached meanwhile, require the attached path
    return NextResponse.json({ error: "Conflict" }, { status: 409 });
  }

  // Best-effort delete
  try {
    const { deleteObject } = await import("@/lib/images/r2");
    await deleteObject(key).catch(() => {});
  } catch {
    // ignore
  }

  // Keep Upload row for audit, or delete it if you prefer:
  // await prisma.upload.delete({ where: { key } }).catch(() => {});

  return NextResponse.json({ ok: true }, { status: 200 });
}
