"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/* ──────────────────────────────────────────────────────────────────────────
   Input validation
   - Matches your current Prisma schema fields.
   - "draft" uses isPublic=false and no slug.
   - "publish" sets isPublic=true and generates a unique slug.
   ────────────────────────────────────────────────────────────────────────── */

const BaseSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  imageUrl: z.string().url().optional().nullable(),
  ingredients: z.array(z.string().trim()).default([]),
  steps: z.array(z.string().trim()).default([]),
  tags: z.array(z.string().trim()).default([]),
  sourceUrl: z.string().url().optional().nullable(),
  // You may ignore this from the client; it's derived from sourceUrl
  isPublic: z.boolean().optional(), // action decides final value
});

type RecipeInput = z.infer<typeof BaseSchema>;

/* ──────────────────────────────────────────────────────────────────────────
   Auth helper
   ────────────────────────────────────────────────────────────────────────── */
async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id as string;
}

/* ──────────────────────────────────────────────────────────────────────────
   Slug helpers
   ────────────────────────────────────────────────────────────────────────── */
function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

async function uniqueRecipeSlug(baseTitle: string) {
  const base = slugify(baseTitle) || "recipe";
  let candidate = base;
  let n = 2;

  // Use findUnique on unique field "slug"
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await prisma.recipe.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
    candidate = `${base}-${n++}`;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Actions
   - saveDraft: create a private recipe (no slug), type derived from sourceUrl
   - publishRecipe: create a public recipe with unique slug
   - publishDraft: turn an existing private recipe into public + add slug
   - updateRecipe: edit an existing private recipe (no slug changes here)
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Save a new draft (private). No slug is generated for drafts.
 * Returns the new recipe id.
 */
export async function saveDraft(input: RecipeInput) {
  const userId = await requireUserId();
  const data = BaseSchema.parse(input);

  const recipe = await prisma.recipe.create({
    data: {
      ownerId: userId,
      type: data.sourceUrl ? "EXTERNAL" : "OWNED",
      title: data.title || "Untitled Recipe",
      imageUrl: data.imageUrl ?? null,
      ingredients: data.ingredients,
      steps: data.steps,
      tags: data.tags,
      sourceUrl: data.sourceUrl ?? null,
      // slug: null (implicit)
      isPublic: false, // draft = private
    },
    select: { id: true },
  });

  // Revalidate any listings that show "My Recipes"
  revalidatePath("/recipes");
  return { id: recipe.id };
}

/**
 * Publish a new recipe directly (public) — generates a unique slug.
 * Returns { id, slug }.
 */
export async function publishRecipe(input: RecipeInput) {
  const userId = await requireUserId();
  const data = BaseSchema.parse(input);

  const slug = await uniqueRecipeSlug(data.title);

  const recipe = await prisma.recipe.create({
    data: {
      ownerId: userId,
      type: data.sourceUrl ? "EXTERNAL" : "OWNED",
      title: data.title,
      imageUrl: data.imageUrl ?? null,
      ingredients: data.ingredients,
      steps: data.steps,
      tags: data.tags,
      sourceUrl: data.sourceUrl ?? null,
      slug,
      isPublic: true,
    },
    select: { id: true, slug: true },
  });

  revalidatePath("/recipes");
  return { id: recipe.id, slug: recipe.slug! };
}

/**
 * Publish an existing draft (by id). Generates a unique slug and flips isPublic=true.
 * Optional: pass title override; otherwise uses current title.
 */
export async function publishDraft(recipeId: string, opts?: { titleOverride?: string }) {
  const userId = await requireUserId();

  const recipe = await prisma.recipe.findFirst({
    where: { id: recipeId, ownerId: userId },
    select: { id: true, title: true, isPublic: true, slug: true },
  });
  if (!recipe) throw new Error("Recipe not found");
  if (recipe.isPublic) return { id: recipe.id, slug: recipe.slug! };

  const title = (opts?.titleOverride ?? recipe.title).trim() || "recipe";
  const slug = await uniqueRecipeSlug(title);

  const updated = await prisma.recipe.update({
    where: { id: recipe.id },
    data: {
      slug,
      isPublic: true,
    },
    select: { id: true, slug: true },
  });

  revalidatePath("/recipes");
  return { id: updated.id, slug: updated.slug! };
}

/**
 * Update a draft/private recipe (no slug changes here).
 * Useful for “Save Draft” edits. If you need to update a published recipe,
 * you may extend this with authorization and specific field controls.
 */
export async function updateRecipe(
  recipeId: string,
  input: Partial<RecipeInput>
) {
  const userId = await requireUserId();
  const existing = await prisma.recipe.findFirst({
    where: { id: recipeId, ownerId: userId },
    select: { id: true, isPublic: true },
  });
  if (!existing) throw new Error("Recipe not found");

  // Only allow updating fields that exist in schema; validate partials
  const parsed = BaseSchema.partial().parse(input);

  const updated = await prisma.recipe.update({
    where: { id: recipeId },
    data: {
      title: parsed.title,
      imageUrl: parsed.imageUrl ?? undefined,
      ingredients: parsed.ingredients,
      steps: parsed.steps,
      tags: parsed.tags,
      sourceUrl: parsed.sourceUrl ?? undefined,
      // Keep slug and isPublic untouched here
    },
    select: { id: true },
  });

  revalidatePath("/recipes");
  return { id: updated.id };
}
