"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { uniqueRecipeSlug } from "@/lib/uniqueSlug";

const PayloadSchema = z.object({
  url: z.url(), // required
  title: z.string().min(1), // required
  imageUrl: z.url().optional(),
  description: z.string().max(10000).optional(),
  tags: z.array(z.string().trim().min(1).max(48)).optional().default([]),
});

/**
 * Save a link-only recipe with optional tags and note.
 * Redirects to the all recipes page on success.
 */
export async function saveLinkCard(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error("You must be signed in to save link recipes.");

  const raw = {
    url: formData.get("url"),
    title: formData.get("title"),
    imageUrl: formData.get("imageUrl") || undefined,
    description: formData.get("description") || "",
    tags: formData.getAll("tags").filter(Boolean) as string[],
  };

  const parsed = PayloadSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(z.prettifyError(parsed.error) ?? "Invalid input.");
  }

  const { url, title, description, imageUrl, tags } = parsed.data;
  const slug = await uniqueRecipeSlug(title);

  try {
    await prisma.recipe.create({
      data: {
        ownerId: session.user.id,
        type: "EXTERNAL_LINK",
        title,
        description: description || "",
        sourceUrl: url,
        imageExternalUrl: imageUrl || undefined,
        tags: tags ?? [],
        slug,
        status: "PUBLISHED",
        isPublic: false,
      },
    });
  } catch (err) {
    // Keep log minimal; DB/schema mismatches surface here.
    console.error("[create] error:", err);
    throw new Error("Failed to save Link Card. Please try again.");
  }
  redirect("/all");
}
