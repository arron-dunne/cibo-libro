import type { RecipeStatus, RecipeType } from "@prisma/client";

declare global {
  interface Recipe {
    id: string;
    ownerId: string;
    type: RecipeType;
    title: string;
    description: string;
    prepMins?: number | null;
    cookMins?: number | null;
    servings?: number | null;
    imageKey?: string | null;
    imageExternalUrl?: string | null;
    ingredients: string[];
    steps: string[];
    tags: string[];
    note: string
    sourceUrl?: string | null;
    slug: string;
    isPublic: boolean;
    status: RecipeStatus;
    createdAt: Date;
    updatedAt: Date;
  }

  // Recipe used by RecipeForm (not all recipe fields)
  interface RecipeFormRecipe {
    title: string;
    description: string;
    prepMins?: number | null;
    cookMins?: number | null;
    servings?: number | null;
    ingredients: string[];
    steps: string[];
    tags: string[];
    note: string;
    imageKey?: string | null;
  }
}
