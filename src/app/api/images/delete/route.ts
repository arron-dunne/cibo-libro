"server only";

import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { deleteObject } from "@/lib/images/r2";

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

  // If no recipeId is given, check to see if imageKey is attached to a recipe
  const recipeIdFromKey = await prisma.recipe.findUnique({
    where: { imageKey: key },
    select: { id: true },
  });

  const finalRecipeId: string | null = recipeId ?? recipeIdFromKey?.id ?? null;

  // Attached delete path (requires recipeId)
  if (finalRecipeId) {
    const recipe = await prisma.recipe.findUnique({
      where: { id: finalRecipeId },
      select: { ownerId: true, imageKey: true },
    });

    // If recipe missing or not pointing at this key, don't leak existence
    if (!recipe || recipe.imageKey !== key || recipe.ownerId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Flip pointer to null first; then best-effort delete the object.
    await prisma.recipe.update({
      where: { id: finalRecipeId },
      data: { imageKey: null },
      select: { id: true },
    });

    try {
      await deleteObject(key);
    } catch {
      // ignore; idempotent
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Unattached (pending) delete path — must belong to user and not be attached
  const issued = await prisma.upload.findUnique({ where: { key } });
  
  if (!issued || issued.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
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
    await deleteObject(key)
  } catch {
    // ignore
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
