// tests/unit/recipe.validation.spec.ts

import { z } from "zod";
import { describe, it, expect } from "vitest";
import { RecipeSchema } from "@/lib/validation/recipeSchema";


function baseValid() {
  return {
    ownerId: "ckv8q2j5a00000123456789ab", // any cuid()
    type: "OWNED" as const,
    title: "Perfect Scrambled Eggs",
    description: "Soft, custardy eggs.",
    prepMins: 5,
    cookMins: 5,
    servings: 2,
    ingredients: ["Eggs", "Butter", "Salt"],
    steps: ["Crack eggs", "Whisk", "Cook low & slow"],
    tags: ["breakfast", "quick"],
  };
}

describe("RecipeSchema", () => {
  it("accepts a complete, valid payload", () => {
    const data = baseValid();
    const parsed = RecipeSchema.parse(data);
    expect(parsed.title).toBe("Perfect Scrambled Eggs");
    expect(parsed.ingredients).toHaveLength(3);
    expect(parsed.steps[0]).toBe("Crack eggs");
  });

  it("trims strings in array fields and rejects empties", () => {
    const data = {
      ...baseValid(),
      ingredients: ["  Eggs ", "  "], // one valid trimmed, one empty after trim
    };
    const result = RecipeSchema.safeParse(data);
    expect(result.success).toBe(false);
    // if (!result.success) {
    //   // Should flag the empty ingredient
    //   expect(z.treeifyError(result.error).fieldErrors.ingredients?.length).toBeGreaterThan(0);
    // }
  });

//   it("allows optional numeric fields to be omitted but enforces positivity when present", () => {
//     const omitted = { ...baseValid(), prepMins: undefined, cookMins: undefined, servings: undefined };
//     expect(createRecipeSchema.parse(omitted).prepMins).toBeUndefined();

//     const negative = { ...baseValid(), prepMins: -1 };
//     const res = createRecipeSchema.safeParse(negative);
//     expect(res.success).toBe(false);
//   });

//   it("requires a non-empty title", () => {
//     const data = { ...baseValid(), title: "   " };
//     const res = createRecipeSchema.safeParse(data);
//     expect(res.success).toBe(false);
//   });

//   it("validates optional URLs when provided", () => {
//     const good = { ...baseValid(), imageExternalUrl: "https://images.example.com/omelette.jpg" };
//     expect(createRecipeSchema.parse(good).imageExternalUrl).toContain("https://");

//     const bad = { ...baseValid(), imageExternalUrl: "not-a-url" };
//     const res = createRecipeSchema.safeParse(bad);
//     expect(res.success).toBe(false);
//   });

//   it("supports EXTERNAL recipes with sourceUrl but no ingredients/steps", () => {
//     const external = {
//       ...baseValid(),
//       type: "EXTERNAL" as const,
//       ingredients: [],
//       steps: [],
//       sourceUrl: "https://someblog.com/cornbread",
//     };
//     const parsed = createRecipeSchema.parse(external);
//     expect(parsed.type).toBe("EXTERNAL");
//     expect(parsed.ingredients).toHaveLength(0);
//     expect(parsed.sourceUrl).toMatch(/^https:\/\//);
//   });

//   it("rejects invalid ownerId format", () => {
//     const bad = { ...baseValid(), ownerId: "not-a-cuid" };
//     const res = createRecipeSchema.safeParse(bad);
//     expect(res.success).toBe(false);
//   });
});
