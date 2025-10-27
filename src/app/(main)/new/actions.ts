"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uniqueRecipeSlug } from "@/lib/uniqueSlug";
import { RecipeFormRecipe, RecipeFormActionResponse } from "@/types/recipe";

// Validation
const NewRecipeSchema = z.object({
  title: z.string().trim().min(0).max(1000).nullable().optional(),
  description: z.string().trim().min(0).max(10000).nullable().optional(),
  prepMins: z.number().int().positive().max(24 * 60).nullable().optional(),
  cookMins: z.number().int().positive().max(24 * 60).nullable().optional(),
  servings: z.number().int().positive().max(100).nullable().optional(),
  ingredients: z.array(z.string()).transform((xs) => xs.map((s) => s.trim()).filter(Boolean)),
  steps: z.array(z.string()).transform((xs) => xs.map((s) => s.trim()).filter(Boolean)),
  tags: z.array(z.string()).transform((xs) => xs.map((s) => s.trim()).filter(Boolean)),
  note: z.string().trim().min(0).max(10000).nullable().optional(),
  imageKey: z.string().min(3).max(512).nullable().optional()
});

// Save a new recipe (create + return id/slug).
export async function createRecipe(recipe: RecipeFormRecipe): Promise<RecipeFormActionResponse> {
  
  try {
    
    // Ensure user is signed in
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Not authenticated" };
    const userId = session.user.id;

    // Validate data format
    const data = NewRecipeSchema.parse(recipe);

    // Verifiy imageKey is provided
    if (data.imageKey) {

      // Format validation (prevent path traversal)
      const SAFE_KEY_RE = /^user\/[a-zA-Z0-9_-]{10,}\/[a-f0-9-]{8,}\.(jpg|jpeg|png|webp)$/;

      if (!SAFE_KEY_RE.test(data.imageKey) || data.imageKey.includes("..")) {
        return { success: false, error: "Invalid image key format" };
      }

/**
 * Update an existing draft (owner‑only). Returns void.
 * Does not accept or mutate imageKey here.
 */
export async function updateRecipe(id: string, raw: unknown): Promise<void> {
  const userId = await requireUserId();
  const data = RecipePayload.parse(raw);

      if (!upload || upload.userId !== userId) {
        return { success: false, error: "Unauthorized image key" };
      }
      
      // Check imageKey is not already attached to another recipe
      const existing = await prisma.recipe.findFirst({ 
        where: { imageKey: data.imageKey },
        select: { id: true }
      });

      if (existing) {
        return { success: false, error: "Image key already in use"}
      }
    }

    const slug = await uniqueRecipeSlug(data.title ?? "recipe");

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
        imageKey: data.imageKey ?? null,
        slug
      },
      select: { id: true, slug: true },
    });

    return { success: true, slug: created.slug };
    
  } catch (error) {

    return { success: false, error: (error as Error).message };
  
  }
}
