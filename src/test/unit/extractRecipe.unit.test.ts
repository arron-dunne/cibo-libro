import { describe, it, expect } from "vitest";
import { extractRecipe } from "@/lib/import/jsonld";

describe("extractRecipe", () => {
  it("extracts a minimal recipe with only a name", () => {
    const node = {
      name: "Simple Toast",
    };

    const recipe = extractRecipe(node as any);

    expect(recipe).toEqual({
      title: "Simple Toast",
      description: undefined,
      image: undefined,
      ingredients: undefined,
      instructions: undefined,
      servings: undefined,
      prepMins: undefined,
      cookMins: undefined,
      tags: undefined,
      author: undefined,
    });
  });

  it("returns empty title when no fields are present", () => {
    const node = {};

    const recipe = extractRecipe(node as any);

    expect(recipe.title).toBe("");
  });

  it("returns empty title when title is an empty string", () => {
    const node = {
      name: "",
    };

    const recipe = extractRecipe(node as any);

    expect(recipe.title).toBe("");
  });

  it("returns empty title when title is only whitespace", () => {
    const node = {
      name: "   ",
    };

    const recipe = extractRecipe(node as any);

    expect(recipe.title).toBe("");
  });

  it("handles image as a string", () => {
    const node = {
      name: "Image Test",
      image: "https://example.com/image.jpg",
    };

    const recipe = extractRecipe(node as any);

    expect(recipe.image).toBe("https://example.com/image.jpg");
  });

  it("handles image as an array and uses the first item", () => {
    const node = {
      name: "Image Array Test",
      image: [
        "https://example.com/first.jpg",
        "https://example.com/second.jpg",
      ],
    };

    const recipe = extractRecipe(node as any);

    expect(recipe.image).toBe("https://example.com/first.jpg");
  });

  it("handles missing optional fields gracefully", () => {
    const node = {
      name: "Optional Fields Missing",
    };

    const recipe = extractRecipe(node as any);

    expect(recipe.ingredients).toBeUndefined();
    expect(recipe.instructions).toBeUndefined();
    expect(recipe.servings).toBeUndefined();
    expect(recipe.prepMins).toBeUndefined();
    expect(recipe.cookMins).toBeUndefined();
  });

  it("parses numeric and string recipeYield values", () => {
    const numericNode = {
      name: "Numeric Yield",
      recipeYield: 4,
    };

    const stringNode = {
      name: "String Yield",
      recipeYield: "6",
    };

    const numericRecipe = extractRecipe(numericNode as any);
    const stringRecipe = extractRecipe(stringNode as any);

    expect(numericRecipe.servings).toBe(4);
    expect(stringRecipe.servings).toBe(6);
  });

  it("returns empty title when optional fields are present but title is missing", () => {
    const node = {
      description: "A recipe with no name",
      recipeIngredient: ["Flour", "Water"],
      recipeInstructions: ["Mix", "Bake"],
    };

    const recipe = extractRecipe(node as any);

    expect(recipe.title).toBe("");
  });
});
