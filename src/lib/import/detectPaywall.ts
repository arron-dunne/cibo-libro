import { load } from "cheerio"; 

// Look for a paywall in the JSON-LD, return true if we find one
export function detectPaywall(html: string): boolean {
  const $ = load(html);

  // Get all script tags with json-ld
  const allJsonld = $('script[type="application/ld+json"]');
  if (!allJsonld.length) return false;

  const data: object[] = [];

  // Parse the json ld tags into a json object, skipping any malformed data
  allJsonld.each((_, el) => {
    const raw = $(el).text().trim();
    if (!raw) return;

    try {
      data.push(JSON.parse(raw));
    } catch {
      // ignore malformed JSON-LD
    }
  });

  return hasPaywallFlag(data);
}

// Recursive function to search nested JSON object for paywall flags
export function hasPaywallFlag(data: unknown): boolean {

  if (!data) { return false; }

  // Recursive call for each element in an array
  if (Array.isArray(data)) {
    return data.some(hasPaywallFlag);
  }

  if (typeof data === "object") {
    for (const [key, val] of Object.entries(data)) {
      if (key === "isAccessibleForFree" &&
        (val === false || val === "false" || val === 0 || val === "0")
      ) {
        return true;
      }

      // Recursive search on child objects
      if (val && typeof val === "object") {
        if (hasPaywallFlag(val)) return true;
      }
    }
  }

  return false;

}