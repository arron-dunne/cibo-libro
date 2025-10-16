"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uniqueRecipeSlug } from "@/lib/uniqueSlug";

// ────────────────────────────────────────────────────────────────────────────
// Validation
// ────────────────────────────────────────────────────────────────────────────
const RecipePayload = z.object({
  title: z.string().trim().min(0).max(1000).nullable().optional(),
  description: z.string().trim().min(0).max(10000).nullable().optional(),
  prepMins: z.number().int().positive().max(24 * 60).nullable().optional(),
  cookMins: z.number().int().positive().max(24 * 60).nullable().optional(),
  servings: z.number().int().positive().max(100).nullable().optional(),
  ingredients: z.array(z.string()).transform((xs) => xs.map((s) => s.trim()).filter(Boolean)),
  steps: z.array(z.string()).transform((xs) => xs.map((s) => s.trim()).filter(Boolean)),
  tags: z.array(z.string()).transform((xs) => xs.map((s) => s.trim()).filter(Boolean)),
  note: z.string().trim().min(0).max(10000).nullable().optional(),
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
 * Update an existing draft (owner‑only). Returns void.
 * Does not accept or mutate imageKey here.
 */
// export async function updateRecipe(id: string, raw: unknown): Promise<void> {
//   const userId = await requireUserId();
//   const data = RecipePayload.parse(raw);

//   // Ownership check in a single statement
//   const recipe = await prisma.recipe.findUnique({
//     where: { id },
//     select: { ownerId: true },
//   });
//   if (!recipe || recipe.ownerId !== userId) throw new Error("Forbidden");

//   await prisma.recipe.update({
//     where: { id },
//     data: {
//       title: data.title,
//       description: data.description ?? undefined,
//       prepMins: data.prepMins ?? null,
//       cookMins: data.cookMins ?? null,
//       servings: data.servings ?? null,
//       ingredients: data.ingredients,
//       steps: data.steps,
//       tags: data.tags,
//       sourceUrl: data.sourceUrl ?? null,
//       // imageKey is controlled by finalize API
//     },
//   });
// }

/**
 * Save a new recipe (create + return id/slug).
 * We still finalize the cover in the client right after this (if there is a pending upload).
 */
export async function createRecipe(raw: unknown): Promise<{ id: string; slug?: string }> {
  const userId = await requireUserId();
  const data = RecipePayload.parse(raw);
  const slug = await uniqueRecipeSlug(data.title ?? "untitled");

  const created = await prisma.recipe.create({
    data: {
      ownerId: userId,
      type: "OWNED",
      title: data.title ?? undefined,
      description: data.description ?? undefined,
      prepMins: data.prepMins ?? null,
      cookMins: data.cookMins ?? null,
      servings: data.servings ?? null,
      ingredients: data.ingredients,
      steps: data.steps,
      tags: data.tags,
      note: data.note ?? undefined,
      imageKey: null, // finalized separately
      slug
    },
    select: { id: true, slug: true },
  });

  return { id: created.id, slug: created.slug ?? undefined };
}
