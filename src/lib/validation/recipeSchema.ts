import { z } from "zod";

export const RecipeSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(0).max(10_000).nullable().optional(),
  prepMins: z.number().int().positive().max(24 * 60).nullable().optional(),
  cookMins: z.number().int().positive().max(24 * 60).nullable().optional(),
  servings: z.number().int().positive().max(99).nullable().optional(),
  ingredients: z.array(z.string()).transform((xs) => xs.map((s) => s.trim()).filter(Boolean)),
  steps: z.array(z.string()).transform((xs) => xs.map((s) => s.trim()).filter(Boolean)),
  tags: z.array(z.string()).transform((xs) => xs.map((s) => s.trim()).filter(Boolean)),
  sourceUrl: z.string().url().nullable().optional(), // manual adds usually null
});
// export type RecipeSchema = z.infer<typeof RecipeSchema>;