import { describe, it, expect } from "vitest";
import { findRecipeNode } from "@/lib/import/jsonld";

describe("findRecipeNode (unit)", () => {
  it("returns the node when the root object is a Recipe", () => {
    const data = {
      "@type": "Recipe",
      name: "Root Recipe",
    };

    const result = findRecipeNode(data);

    expect(result).not.toBeNull();
    expect(result?.name).toBe("Root Recipe");
  });

  it("finds a Recipe nested inside an object", () => {
    const data = {
      page: {
        mainEntity: {
          "@type": "Recipe",
          name: "Nested Recipe",
        },
      },
    };

    const result = findRecipeNode(data);

    expect(result).not.toBeNull();
    expect(result?.name).toBe("Nested Recipe");
  });

  it("finds a Recipe nested inside an array", () => {
    const data = {
      "@graph": [
        { "@type": "WebPage" },
        { "@type": "Recipe", name: "Array Recipe" },
      ],
    };

    const result = findRecipeNode(data);

    expect(result).not.toBeNull();
    expect(result?.name).toBe("Array Recipe");
  });

  it("matches Recipe when @type is an array", () => {
    const data = {
      "@type": ["Thing", "Recipe"],
      name: "Multi-type Recipe",
    };

    const result = findRecipeNode(data);

    expect(result).not.toBeNull();
    expect(result?.name).toBe("Multi-type Recipe");
  });

  it("returns the first Recipe when multiple recipes exist", () => {
    const data = [
      { "@type": "Recipe", name: "First Recipe" },
      { "@type": "Recipe", name: "Second Recipe" },
    ];

    const result = findRecipeNode(data);

    expect(result).not.toBeNull();
    expect(result?.name).toBe("First Recipe");
  });

  it("returns null when no Recipe is present", () => {
    const data = {
      "@type": "WebPage",
      name: "No Recipe Here",
    };

    const result = findRecipeNode(data);

    expect(result).toBeNull();
  });
});
