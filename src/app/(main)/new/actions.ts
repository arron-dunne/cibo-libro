"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RecipeType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
    imageUrl: z.url().optional().nullable(),
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

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await prisma.recipe.findUnique({ where: { slug: candidate } });
    if (!exists) return candidate;
    candidate = `${base}-${n++}`;
  }
}

function dtoToPrismaData(dto: RecipeDTO) {
  // Only include defined keys to avoid overwriting optional columns unintentionally
  const data: any = {
    title: dto.title,
    ingredients: dto.ingredients,
    steps: dto.steps,
    tags: dto.tags ?? [],
  };
  if (dto.description !== undefined) data.description = dto.description || null;
  if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl || null;
  if (dto.sourceUrl !== undefined) data.sourceUrl = dto.sourceUrl || null;
  if (dto.prepMins !== undefined) data.prepMins = dto.prepMins;
  if (dto.cookMins !== undefined) data.cookMins = dto.cookMins;
  if (dto.servings !== undefined) data.servings = dto.servings;
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

  const slug = existing.slug ?? (await uniqueRecipeSlug(existing.title));

  const published = await prisma.recipe.update({
    where: { id },
    data: { isPublic: true, slug },
    select: { id: true, slug: true },
  });

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${published.slug}`);
  return published;
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
  revalidatePath(`/recipes/${created.slug}`);
  return created;
}
