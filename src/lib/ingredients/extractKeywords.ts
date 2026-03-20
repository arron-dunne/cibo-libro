const UNITS = [
  // Metric
  "g",
  "gram",
  "grams",
  "kg",
  "kilogram",
  "kilograms",
  "ml",
  "milliliter",
  "milliliters",
  "l",
  "liter",
  "litre",
  "liters",
  "litres",

  // Imperial / US
  "oz",
  "ounce",
  "ounces",
  "lb",
  "lbs",
  "pound",
  "pounds",
  "pt",
  "pint",
  "pints",
  "qt",
  "quart",
  "quarts",
  "gal",
  "gallon",
  "gallons",

  // Volume
  "tsp",
  "tsps",
  "teaspoon",
  "teaspoons",
  "tbsp",
  "tbsps",
  "tablespoon",
  "tablespoons",
  "cup",
  "cups",

  // Counts & containers
  "clove",
  "cloves",
  "slice",
  "slices",
  "piece",
  "pieces",
  "packet",
  "packets",
  "pkg",
  "pkts",
  "can",
  "cans",
  "jar",
  "jars",
  "tin",
  "tins",
  "stick",
  "sticks",
  "bunch",
  "bunches",
  "sheet",
  "sheets",
  "block",
  "blocks",

  // Food forms / preparations (not food nouns — strip these)
  "extract",
  "powder",
  "paste",
  "flakes",
  "concentrate",
  "spray",

  // Misc / colloquial
  "dash",
  "pinch",
  "sprig",
  "sprigs",
  "handful",
  "handfuls",
  "drop",
  "drops",
  "strip",
  "strips",
  "cube",
  "cubes",
];

const PREP_WORDS = [
  "chopped",
  "sliced",
  "diced",
  "minced",
  "grated",
  "crushed",
  "peeled",
  "halved",
  "quartered",
  "trimmed",
  "rinsed",
  "drained",
  "washed",
  "seeded",
  "de-seeded",
  "deseeded",
  "hulled",
  "pitted",
  "zested",
  "beaten",
  "whisked",
  "stirred",
  "mixed",
  "combined",
  "melted",
  "softened",
  "boiled",
  "simmered",
  "fried",
  "roasted",
  "baked",
  "grilled",
  "toasted",
  "mashed",
  "pureed",
  "blended",
  "ground",
  "shredded",
  "crumbled",
  "sifted",
  "dusted",
  "coarsely",
  "finely",
  "roughly",
  "fresh",
  "freshly",
  "frozen",
  "cooked",
  "raw",
  "hot",
  "cold",
  "warm",
  "room-temperature",
  "to",
  "taste",
  "seasoned",
  "optional",
  "serve",
];

const FILLER_WORDS = [
  "a",
  "an",
  "the",
  "of",
  "and",
  "or",
  "to",
  "for",
  "with",
  "in",
  "into",
  "on",
  "at",
  "by",
  "from",
  "as",
  "about",
  "around",
  "plus",
  "extra",
  "more",
  "less",
  "each",
  "per",
  "few",
  "several",
  "some",
  "any",
  "many",
  "small",
  "medium",
  "large",
  "extra-large",
  "heaping",
  "level",
  "rounded",
  "scant",
  "generous",
  "good",
  "big",
  "tiny",
  "whole",
  "half",
  "quarter",
  "double",
  "single",
  "x",
];

export function extractIngredientKeyword(line: string | null): string | null {
  if (!line) return null;

  let clean = line
    .toLowerCase()
    .replace(/\d+\/\d+|\d+(\.\d+)?/g, "") // remove numbers like 500, 1/2, 2.5
    .replace(/[^\w\s]/g, " ") // remove punctuation
    .trim();

  // remove units
  UNITS.forEach(
    (u) => (clean = clean.replace(new RegExp(`\\b${u}\\b`, "g"), "")),
  );

  // remove prep words
  PREP_WORDS.forEach(
    (p) => (clean = clean.replace(new RegExp(`\\b${p}\\b`, "g"), "")),
  );

  // remove filler words
  FILLER_WORDS.forEach(
    (f) => (clean = clean.replace(new RegExp(`\\b${f}\\b`, "g"), "")),
  );

  // remove extra spaces
  clean = clean.replace(/\s+/g, " ").trim();

  // take the last word — the noun — since units/descriptors appear before the food name
  const words = clean.split(" ").filter(Boolean);
  if (!words.length) return null;

  return words[words.length - 1];
}
