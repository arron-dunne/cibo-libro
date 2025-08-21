// app/new/actions.ts

"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RecipeType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { uniqueRecipeSlug } from "@/lib/uniqueSlug";

/* ──────────────────────────────────────────────────────────────────────────
   Recipe DTO schemas
   ────────────────────────────────────────────────────────────────────────── */

const stringToInt = z
  .union([z.string(), z.number()])
  .transform((v) => (typeof v === "string" && v.trim() === "" ? undefined : v))
  .refine((v) => v === undefined || (typeof v === "string" ? /^-?\d+$/.test(v) : Number.isInteger(v)), {
    message: "Must be an integer",
  })
  .transform((v) => (v === undefined ? undefined : typeof v === "string" ? parseInt(v, 10) : v));

const NonEmptyLine = z.string().trim().min(1);

const BaseSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().optional().nullable(),
    imageKey: z.string().trim().optional().nullable(),
    sourceUrl: z.url().optional().nullable(),
    ingredients: z.array(NonEmptyLine).min(1, "At least one ingredient"),
    steps: z.array(NonEmptyLine).min(1, "At least one step"),
    tags: z.array(z.string().trim()).default([]),

    // new numeric fields (support multiple keys)
    prepMins: stringToInt.optional().nullable(),
    cookMins: stringToInt.optional().nullable(),
    servings: stringToInt.optional().nullable(),
  });

type RecipeDTO = z.infer<typeof BaseSchema>;

function requireUserId() {
  return auth().then((s) => {
    if (!s?.user?.id) throw new Error("Not authenticated");
    return s.user.id as string;
  });
}

// Type describing the subset of fields we actually write via these actions
type RecipeWritableData = {
  title: string;
  description?: string; // prisma expects string | undefined (not null)
  imageKey?: string;
  sourceUrl?: string;
  prepMins?: number | null;
  cookMins?: number | null;
  servings?: number | null;
  ingredients: string[];
  steps: string[];
  tags?: string[];
};

function dtoToPrismaData(dto: RecipeDTO) {
  // Only include defined keys to avoid overwriting optional columns unintentionally
  const data: RecipeWritableData = {
    title: dto.title,
    ingredients: dto.ingredients,
    steps: dto.steps,
    tags: dto.tags ?? [],
  };
  // Strings: avoid assigning null — Prisma create type is string | undefined
  if (dto.description !== undefined) {
    const d = typeof dto.description === 'string' ? dto.description.trim() : undefined;
    if (d && d.length > 0) data.description = d; // else leave undefined to use default
  }
  if (dto.imageKey !== undefined) {
    const u = dto.imageKey ?? undefined;
    if (u) data.imageKey = u;
  }
  if (dto.sourceUrl !== undefined) {
    const u = dto.sourceUrl ?? undefined;
    if (u) data.sourceUrl = u;
  }
  // Numbers: allow null when columns are nullable, otherwise leave undefined
  if (dto.prepMins !== undefined) data.prepMins = dto.prepMins ?? null;
  if (dto.cookMins !== undefined) data.cookMins = dto.cookMins ?? null;
  if (dto.servings !== undefined) data.servings = dto.servings ?? null;
  return data;
}

/* ──────────────────────────────────────────────────────────────────────────
   Actions
   saveDraft(dto) → create private recipe
   updateRecipe(id, dto) → update fields on draft or private recipe
   publishDraft(id) → make existing draft public + slug
   publishRecipe(dto) → create public recipe directly
   ────────────────────────────────────────────────────────────────────────── */

export async function saveDraft(input: unknown) {
  const userId = await requireUserId();
  const parsed = BaseSchema.parse(input);

  const created = await prisma.recipe.create({
    data: {
      ownerId: userId,
      type: RecipeType.OWNED,
      isPublic: false,
      ...dtoToPrismaData(parsed),
    },
    select: { id: true },
  });

  revalidatePath("/recipes");
  return { id: created.id };
}

export async function updateRecipe(id: string, input: unknown) {
  const userId = await requireUserId();
  const parsed = BaseSchema.parse(input);

  const existing = await prisma.recipe.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== userId) throw new Error("Not found");

  const updated = await prisma.recipe.update({
    where: { id },
    data: {
      ...dtoToPrismaData(parsed),
      // do not touch slug/isPublic here
    },
    select: { id: true },
  });

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${id}`);
  return { id: updated.id };
}

export async function publishDraft(id: string) {
  const userId = await requireUserId();
  const existing = await prisma.recipe.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== userId) throw new Error("Not found");

  // If already public, just return
  if (existing.isPublic) return { id: existing.id, slug: existing.slug };

  const slug = existing.slug ?? (await uniqueRecipeSlug(existing.title));

  const updated = await prisma.recipe.update({
    where: { id },
    data: { isPublic: true, slug },
    select: { id: true, slug: true },
  });

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${updated.slug}`);
  return updated;
}

export async function publishRecipe(input: unknown) {
  const userId = await requireUserId();
  const parsed = BaseSchema.parse(input);

  const slug = await uniqueRecipeSlug(parsed.title);

  const created = await prisma.recipe.create({
    data: {
      ownerId: userId,
      type: RecipeType.OWNED,
      isPublic: true,
      slug,
      ...dtoToPrismaData(parsed),
    },
    select: { id: true, slug: true },
  });

  revalidatePath("/recipes");
  revalidatePath(`/view/${created.slug}`);
  return created;
}
