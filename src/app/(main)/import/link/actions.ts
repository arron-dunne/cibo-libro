"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { uniqueRecipeSlug } from "@/lib/uniqueSlug";

const PayloadSchema = z.object({
  url: z.url(),
  title: z.string().min(1).max(280),
  image: z.url().optional().nullable(),

  // User-entered metadata
  note: z.string().max(10_000).optional().nullable(),
  tags: z.array(z.string().trim().min(1).max(48)).optional().default([]),
});

/**
 * Save a link-only recipe with optional tags and note.
 * Redirects to the created recipe on success.
 */
export async function saveLinkCard(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("You must be signed in to save link recipes.");

  const raw = {
    url: formData.get("url"),
    title: formData.get("title"),
    image: emptyToNull(formData.get("image")),
    note: emptyToNull(formData.get("note")),
    tags: formData.getAll("tags").filter(Boolean) as string[],
  };

  const parsed = PayloadSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(z.prettifyError(parsed.error) ?? "Invalid input.");
  }

  const { url, title, image, note, tags } = parsed.data;
  const slug = await uniqueRecipeSlug(title);

  try {
    await prisma.recipe.create({
      data: {
        ownerId: session.user.id,
        type: "EXTERNAL_LINK",
        title,
        sourceUrl: url.toString(),
        imageExternalUrl: image,
        note: note ?? undefined,
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
  redirect(`/view/${slug}`);
}

function emptyToNull(v: FormDataEntryValue | null): string | null {
  const s = (v ?? "").toString().trim();
  return s.length ? s : null;
}
