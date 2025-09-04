// app/new/actions.ts

"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uniqueRecipeSlug } from "@/lib/uniqueSlug";

// ────────────────────────────────────────────────────────────────────────────
// Validation (payload you send from AddRecipeClient.snapshot())
// NOTE: imageKey is intentionally NOT accepted here — it’s flipped by /api/images/finalize
// ────────────────────────────────────────────────────────────────────────────
const RecipePayload = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(0).max(10_000).nullable().optional(),
  prepMins: z.number().int().positive().max(24 * 60).nullable().optional(),
  cookMins: z.number().int().positive().max(24 * 60).nullable().optional(),
  servings: z.number().int().positive().max(200).nullable().optional(),
  ingredients: z.array(z.string()).transform((xs) => xs.map((s) => s.trim()).filter(Boolean)),
  steps: z.array(z.string()).transform((xs) => xs.map((s) => s.trim()).filter(Boolean)),
  tags: z.array(z.string()).transform((xs) => xs.map((s) => s.trim()).filter(Boolean)),
  sourceUrl: z.string().url().nullable().optional(), // manual adds usually null
});
export type RecipePayload = z.infer<typeof RecipePayload>;

// Small helper to enforce auth everywhere
async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

// ────────────────────────────────────────────────────────────────────────────
// ACTIONS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Create a new draft recipe (owned). Returns { id, slug? }.
 * Image attachment is handled separately via /api/images/finalize.
 */
export async function saveDraft(raw: unknown): Promise<{ id: string; slug?: string }> {
  const userId = await requireUserId();
  const data = RecipePayload.parse(raw);
  const slug = await uniqueRecipeSlug(data.title);

  // Create a record; imageKey intentionally left null (finalize API will set it)
  // Adjust fields to your schema names if they differ.
  const created = await prisma.recipe.create({
    data: {
      ownerId: userId,
      type: "OWNED", // Prisma enum RecipeType
      title: data.title,
      description: data.description ?? undefined,
      prepMins: data.prepMins ?? null,
      cookMins: data.cookMins ?? null,
      servings: data.servings ?? null,
      ingredients: data.ingredients,
      steps: data.steps,
      tags: data.tags,
      sourceUrl: data.sourceUrl ?? null,
      imageKey: null,
      isPublic: false,
      slug
    },
    select: { id: true, slug: true },
  });

  return { id: created.id, slug: created.slug ?? undefined };
}

/**
 * Update an existing draft (owner‑only). Returns void.
 * Does not accept or mutate imageKey here.
 */
export async function updateRecipe(id: string, raw: unknown): Promise<void> {
  const userId = await requireUserId();
  const data = RecipePayload.parse(raw);

  // Ownership check in a single statement
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: { ownerId: true },
  });
  if (!recipe || recipe.ownerId !== userId) throw new Error("Forbidden");

  await prisma.recipe.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description ?? undefined,
      prepMins: data.prepMins ?? null,
      cookMins: data.cookMins ?? null,
      servings: data.servings ?? null,
      ingredients: data.ingredients,
      steps: data.steps,
      tags: data.tags,
      sourceUrl: data.sourceUrl ?? null,
      // imageKey is controlled by finalize API
    },
  });
}

/**
 * Publish a *new* recipe (create + return id/slug).
 * We still finalize the cover in the client right after this (if there is a pending upload).
 */
export async function publishRecipe(raw: unknown): Promise<{ id: string; slug?: string }> {
  const userId = await requireUserId();
  const data = RecipePayload.parse(raw);
  const slug = await uniqueRecipeSlug(data.title);

  const created = await prisma.recipe.create({
    data: {
      ownerId: userId,
      type: "OWNED",
      title: data.title,
      description: data.description ?? undefined,
      prepMins: data.prepMins ?? null,
      cookMins: data.cookMins ?? null,
      servings: data.servings ?? null,
      ingredients: data.ingredients,
      steps: data.steps,
      tags: data.tags,
      sourceUrl: data.sourceUrl ?? null,
      imageKey: null, // finalized separately
      isPublic: true, // if your flow wants immediate publish; set false if publish == finalize editing only
      slug
    },
    select: { id: true, slug: true },
  });

  return { id: created.id, slug: created.slug ?? undefined };
}

/**
 * Publish an *existing* draft by id.
 * If your schema tracks publish state, flip it here; otherwise just return an id/slug.
 */
export async function publishDraft(id: string): Promise<{ id: string; slug?: string }> {
  const userId = await requireUserId();

  const rec = await prisma.recipe.findUnique({
    where: { id },
    select: { id: true, ownerId: true, slug: true, isPublic: true },
  });
  if (!rec || rec.ownerId !== userId) throw new Error("Forbidden");

  // If you track publication flag, set it here:
  if (!rec.isPublic) {
    const updated = await prisma.recipe.update({
      where: { id },
      data: { isPublic: true },
      select: { id: true, slug: true },
    });
    return { id: updated.id, slug: updated.slug ?? undefined };
  }

  return { id: rec.id, slug: rec.slug ?? undefined };
}
