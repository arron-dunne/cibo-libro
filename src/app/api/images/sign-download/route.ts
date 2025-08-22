// app/api/images/sign-download/route.ts
"use server";

import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signGet } from "@/lib/images/r2";

// --- Validation --------------------------------------------------------------
const Body = z.object({
  key: z.string().min(3).max(512),
  recipeId: z.uuid().optional(),   // optional, helps tighten auth for recipe views
});

// Only allow user-scoped keys we generate, and block path traversal.
const SAFE_KEY_RE = /^user\/[a-zA-Z0-9_-]{10,}\/[a-f0-9-]{8,}\.(jpg|jpeg|png|webp)$/;

// --- Handler -----------------------------------------------------------------
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const { key, recipeId } = body;

  // Basic key hygiene (defense-in-depth; the signer will also enforce)
  if (!SAFE_KEY_RE.test(key) || key.includes("..")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  // --- Authorization paths ---------------------------------------------------
  // Path A: Tied to a recipe (preferred for normal viewing)
  if (recipeId) {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { ownerId: true, isPublic: true, imageKey: true },
    });

    // If recipe missing or not pointing at this key, don't leak existence
    if (!recipe || recipe.imageKey !== key) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // If it's not public, only the owner can see it
    if (!recipe.isPublic && recipe.ownerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } else {
    // Path B: No recipe context — allow only if this key was issued to this user (pre‑finalize, etc.)
    const issued = await prisma.upload.findUnique({ where: { key } });
    if (!issued || issued.userId !== userId) {
      // Hide whether the key exists
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  // All checks passed → sign a short-lived GET URL
  const { url, expiresIn } = await signGet({ key });

  return NextResponse.json({ url, expiresIn }, { status: 200 });
}
