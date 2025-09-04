// app/import/link/actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uniqueRecipeSlug } from "@/lib/uniqueSlug";

const PayloadSchema = z.object({
  url: z.url(),
  title: z.string().min(1).max(280),
  siteName: z.string().optional().nullable(),
  image: z.url().optional().nullable(),

  // User-entered metadata
  note: z.string().max(10_000).optional().nullable(),
  tags: z.array(z.string().trim().min(1).max(48)).optional().default([]),

  // rating intentionally omitted (no column yet)
});

export type SaveLinkCardResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function saveLinkCard(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    // You can also throw a redirect to /signin with a returnTo param if you like
    throw new Error("You must be signed in to save link recipes");
  }

  // Extract fields from the form (keep names in sync with the form below)
  const raw = {
    url: formData.get("url"),
    title: formData.get("title"),
    // siteName: emptyToNull(formData.get("siteName")),
    image: emptyToNull(formData.get("image")),
    note: emptyToNull(formData.get("note")),
    tags: formData.getAll("tags").filter(Boolean) as string[],
  };

  const parsed = PayloadSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(z.prettifyError(parsed.error));
  }

  const { url, title, image, note, tags } = parsed.data;

  const slug = await uniqueRecipeSlug(title);

  try {
    // 🔐 IMPORTANT:
    // The block below assumes a fairly standard schema. Adjust the field names
    // to match your actual Prisma models. If your schema differs, tweak the
    // "create" shape but keep the same high-level flow.

    // ——— Example shape (adapt this mapping) ———
    // model Recipe {
    //   id         String   @id @default(cuid())
    //   ownerId    String
    //   title      String
    //   sourceUrl  String
    //   siteName   String?
    //   imageUrl   String?
    //   isLinkCard Boolean  @default(true)
    //   reason     String   // 'ROBOTS' | 'DENYLISTED' | 'PAYWALL' | 'NO_SCHEMA' | 'ERROR'
    //   notes      String?
    //   tags       RecipeTag[] // via join table
    //   createdAt  DateTime @default(now())
    //   updatedAt  DateTime @updatedAt
    // }
    //
    // model Tag { id String @id @default(cuid()) name String @unique recipes RecipeTag[] }
    // model RecipeTag { recipeId String tagId String @@id([recipeId, tagId]) }

    const created = await prisma.recipe.create({
      data: {
        ownerId: session.user.id,
        type: "EXTERNAL",
        title,
        sourceUrl: url.toString(),
        imageExternalUrl: image,
        note,
        tags,
        slug,
      },
    });

    // Revalidate anything that lists recipes, then bounce to the new card (or back to /all)
    revalidatePath("/all");
    redirect(`/view/${slug}`)
  } catch (err: any) {
    console.error("[saveLinkCard] failed:", err);
  }
}

function emptyToNull(v: FormDataEntryValue | null): string | null {
  const s = (v ?? "").toString().trim();
  return s.length ? s : null;
}
