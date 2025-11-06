import type { RecipeStatus, RecipeType } from "@prisma/client";

declare global {
  interface Recipe {
    id?: string;
    ownerId?: string;
    type?: RecipeType;
    title: string;
    description?: string;
    prepMins?: number | null;
    cookMins?: number | null;
    servings?: number | null;
    imageKey?: string | null;
    imageExternalUrl?: string | null;
    ingredients?: string[];
    steps?: string[];
    tags?: string[];
    note?: string
    sourceUrl?: string | null;
    slug: string;
    isPublic?: boolean;
    status?: RecipeStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }

}

// // Recipe used by RecipeForm (not all recipe fields)
// interface RecipeFormRecipe {
//   id: string | null;
//   title?: string | null;
//   description?: string | null;
//   prepMins?: number | null;
//   cookMins?: number | null;
//   servings?: number | null;
//   ingredients: string[];
//   steps: string[];
//   tags: string[];
//   note?: string | null;
//   imageKey?: string | null;
// }

// // Response object returned by server actions handling recipe form submissions
// interface RecipeFormActionResponse {
//   success: boolean, 
//   slug?: string, 
//   error?: string
// }