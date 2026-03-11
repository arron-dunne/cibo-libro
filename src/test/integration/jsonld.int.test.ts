import { describe, it, expect } from "vitest";
import { parseJsonLd } from "@/lib/import/jsonld";

describe("parseJsonLd (integration)", () => {
  it("extracts a recipe from valid JSON-LD with HowToStep instructions", () => {
    const html = `
      <html>
        <head>
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Recipe",
              "name": "Test Pasta",
              "recipeIngredient": ["Pasta", "Salt"],
              "recipeInstructions": [
                { "@type": "HowToStep", "text": "Boil water" },
                { "@type": "HowToStep", "text": "Cook pasta" }
              ],
              "prepTime": "PT10M",
              "cookTime": "PT20M"
            }
          </script>
        </head>
      </html>
    `;

    const recipe = parseJsonLd(html);

    expect(recipe).toMatchObject({
      title: "Test Pasta",
      ingredients: ["Pasta", "Salt"],
      instructions: ["Boil water", "Cook pasta"],
      prepMins: 10,
      cookMins: 20,
    });
  });

  it("ignores malformed JSON-LD and still finds a valid recipe", () => {
    const html = `
      <script type="application/ld+json">{ bad json }</script>
      <script type="application/ld+json">
        { "@type": "Recipe", "name": "Valid One" }
      </script>
    `;

    const recipe = parseJsonLd(html);

    expect(recipe?.title).toBe("Valid One");
  });

  it("returns null when a recipe has no title but has other fields", () => {
    const html = `
      <script type="application/ld+json">
        {
          "@type": "Recipe",
          "description": "A recipe with no title",
          "recipeIngredient": ["Flour", "Water"]
        }
      </script>
    `;

    const recipe = parseJsonLd(html);

    expect(recipe).toBeNull();
  });

  it("returns null when a recipe title is an empty or whitespace string", () => {
    const html = `
      <script type="application/ld+json">
        {
          "@type": "Recipe",
          "name": "   ",
          "recipeIngredient": ["Eggs"]
        }
      </script>
    `;

    const recipe = parseJsonLd(html);

    expect(recipe).toBeNull();
  });

  it("finds a Recipe nested inside a larger JSON-LD structure", () => {
    const html = `
      <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "mainEntity": {
            "@type": "Recipe",
            "name": "Nested Recipe"
          }
        }
      </script>
    `;

    const recipe = parseJsonLd(html);

    expect(recipe?.title).toBe("Nested Recipe");
  });
});
