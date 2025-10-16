"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const UpdateRecipeSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  prepMins: z.number().nullable(),
  cookMins: z.number().nullable(),
  servings: z.number().nullable(),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
  tags: z.array(z.string()),
});

export async function updateRecipe(formData: unknown) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const parsed = UpdateRecipeSchema.safeParse(formData);
  if (!parsed.success) return { success: false, error: "Invalid data" };
  const data = parsed.data;

  const recipe = await prisma.recipe.findUnique({ where: { id: data.id } });
  if (!recipe || recipe.ownerId !== session.user.id)
    return { success: false, error: "Unauthorized" };

  const updated = await prisma.recipe.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.description || "",
      prepMins: data.prepMins,
      cookMins: data.cookMins,
      servings: data.servings,
      ingredients: data.ingredients,
      steps: data.steps,
      tags: data.tags,
    },
  });

  return { success: true, slug: updated.slug };
}
