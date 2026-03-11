import { describe, it, expect } from "vitest";
import { detectPaywall } from "@/lib/import/detectPaywall";

describe("detectPaywall (integration)", () => {
  it("returns false when no JSON-LD is present", () => {
    const html = "<html><body>Hello</body></html>";
    expect(detectPaywall(html)).toBe(false);
  });

  it("detects paywall from JSON-LD script", () => {
    const html = `
      <script type="application/ld+json">
        { "isAccessibleForFree": false }
      </script>
    `;
    expect(detectPaywall(html)).toBe(true);
  });

  it("ignores malformed JSON-LD", () => {
    const html = `
      <script type="application/ld+json">{ nope }</script>
    `;
    expect(detectPaywall(html)).toBe(false);
  });

  it("detects paywall across multiple JSON-LD blocks", () => {
    const html = `
      <script type="application/ld+json">{}</script>
      <script type="application/ld+json">
        { "isAccessibleForFree": false }
      </script>
    `;
    expect(detectPaywall(html)).toBe(true);
  });
});
