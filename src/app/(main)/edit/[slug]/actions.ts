"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { uniqueRecipeSlug } from "@/lib/uniqueSlug";
import { RecipeFormActionResponse, RecipeFormRecipe } from "@/types/recipe";

// Validation
const UpdateRecipeSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(0).max(1000).nullable().optional(),
  description: z.string().trim().min(0).max(10000).nullable().optional(),
  prepMins: z
    .number()
    .int()
    .positive()
    .max(24 * 60)
    .nullable()
    .optional(),
  cookMins: z
    .number()
    .int()
    .positive()
    .max(24 * 60)
    .nullable()
    .optional(),
  servings: z.number().int().positive().max(100).nullable().optional(),
  ingredients: z
    .array(z.string())
    .transform((xs) => xs.map((s) => s.trim()).filter(Boolean)),
  steps: z
    .array(z.string())
    .transform((xs) => xs.map((s) => s.trim()).filter(Boolean)),
  tags: z
    .array(z.string())
    .transform((xs) => xs.map((s) => s.trim()).filter(Boolean)),
  note: z.string().trim().min(0).max(10000).nullable().optional(),
  imageKey: z.string().min(3).max(512).nullable().optional(),
});

// Server Action
export async function updateRecipe(
  recipe: RecipeFormRecipe,
): Promise<RecipeFormActionResponse> {
  try {
    // Ensure user is signed in
    const session = await auth();
    if (!session?.user?.id)
      return { success: false, error: "Not authenticated" };
    const userId = session.user.id;

    // Validate data format
    const data = UpdateRecipeSchema.parse(recipe);

    // Validate user owns recipe
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: data.id },
      select: { ownerId: true, title: true, slug: true },
    });

    if (!existingRecipe || existingRecipe.ownerId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Verifiy imageKey is provided
    if (data.imageKey) {
      // Format validation (prevent path traversal)
      const SAFE_KEY_RE =
        /^user\/[a-zA-Z0-9_-]{10,}\/[a-f0-9-]{8,}\.(jpg|jpeg|png|webp)$/;

      if (!SAFE_KEY_RE.test(data.imageKey) || data.imageKey.includes("..")) {
        return { success: false, error: "Invalid image key format" };
      }

      // Provenance check (check user owns and uploaded image)
      const upload = await prisma.upload.findUnique({
        where: { key: data.imageKey },
      });

      if (!upload || upload.userId !== userId) {
        return { success: false, error: "Unauthorized image key" };
      }

      // Check imageKey is not attached to another recipe
      const existing = await prisma.recipe.findFirst({
        where: {
          imageKey: data.imageKey,
          NOT: { id: data.id },
        },
        select: { id: true },
      });

      if (existing) {
        return { success: false, error: "Image key already in use" };
      }
    }

    let slug = existingRecipe.slug;

    // Update slug if title changed
    if (data.title !== existingRecipe.title) {
      slug = await uniqueRecipeSlug(data.title ?? "recipe");
    }

    // Perform update
    const updated = await prisma.recipe.update({
      where: { id: data.id },
      data: {
        title: data.title ?? "",
        description: data.description ?? "",
        prepMins: data.prepMins ?? null,
        cookMins: data.cookMins ?? null,
        servings: data.servings ?? null,
        ingredients: data.ingredients ?? [],
        steps: data.steps ?? [],
        tags: data.tags ?? [],
        note: data.note ?? "",
        imageKey: data.imageKey ?? null,
        updatedAt: new Date(),
        slug,
      },
      select: { slug: true },
    });

    return { success: true, slug: updated.slug };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
