import { describe, it, expect } from "vitest";
import { extractInstructions } from "@/lib/import/jsonld";

describe("extractInstructions", () => {
  it("returns a single instruction when input is a string", () => {
    const input = "Mix all ingredients";

    const result = extractInstructions(input);

    expect(result).toEqual(["Mix all ingredients"]);
  });

  it("returns instructions when input is an array of strings", () => {
    const input = ["Boil water", "Add pasta", "Drain"];

    const result = extractInstructions(input);

    expect(result).toEqual(["Boil water", "Add pasta", "Drain"]);
  });

  it("extracts text from HowToStep objects", () => {
    const input = [
      { "@type": "HowToStep", text: "Chop onions" },
      { "@type": "HowToStep", text: "Fry onions" },
    ];

    const result = extractInstructions(input);

    expect(result).toEqual(["Chop onions", "Fry onions"]);
  });

  it("handles mixed instruction formats in an array", () => {
    const input = [
      "Preheat oven",
      { "@type": "HowToStep", text: "Bake for 20 minutes" },
      { foo: "bar" }, // ignored
    ];

    const result = extractInstructions(input);

    expect(result).toEqual([
      "Preheat oven",
      "Bake for 20 minutes",
    ]);
  });

  it("returns undefined when instructions are empty or invalid", () => {
    const input = [{ foo: "bar" }, null, 123];

    const result = extractInstructions(input);

    expect(result).toBeUndefined();
  });
});
