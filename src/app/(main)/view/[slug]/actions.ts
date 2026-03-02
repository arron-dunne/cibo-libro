"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import z from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function setRecipeFavourite(slug: string, isFavourite: boolean): Promise<void> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const recipe = await prisma.recipe.findFirst({
    where: { slug, ownerId: session.user.id },
    select: { id: true },
  });
  if (!recipe) throw new Error("Not found");

  await prisma.recipe.update({
    where: { id: recipe.id },
    data: { isFavourite },
  });

  revalidatePath("/all");
}

const DeleteRecipeSchema = z.object({
  slug: z.string(),
});

export async function deleteRecipe(formData: FormData): Promise<void> {
  // Check valid user
  const session = await auth();
  if (!session?.user) {
    throw Error("Unauthorized");
  }

  const raw = { slug: String(formData.get("slug") || "") };

  // Parse formData
  const parsed = DeleteRecipeSchema.safeParse(raw);

  if (!parsed.success) throw Error("Invalid");

  // Check user owns recipe
  const recipe = await prisma.recipe.findFirst({
    where: { slug: parsed.data.slug },
    select: {
      id: true,
      ownerId: true,
    },
  });
  if (!recipe || recipe.ownerId !== session.user.id) throw Error("Not found");

  // Delete recipe
  await prisma.recipe.delete({
    where: { id: recipe.id },
  });

  // Revalidate and redirect
  revalidatePath("/all");
  redirect("/all");
}
