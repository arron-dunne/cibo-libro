import { describe, it, expect } from "vitest";
import { hasPaywallFlag } from "@/lib/import/detectPaywall";

describe("hasPaywallFlag (unit)", () => {

  it("returns false for null or undefined", () => {
    expect(hasPaywallFlag(null)).toBe(false);
    expect(hasPaywallFlag(undefined)).toBe(false);
  });

  it("returns false for primitives", () => {
    expect(hasPaywallFlag(true)).toBe(false);
    expect(hasPaywallFlag("string")).toBe(false);
    expect(hasPaywallFlag(42)).toBe(false);
  });

  it("detects paywall at root level", () => {
    expect(
      hasPaywallFlag({ isAccessibleForFree: false })
    ).toBe(true);
  });

  it("detects nested paywall flag", () => {
    expect(
      hasPaywallFlag({
        a: {
          b: {
            isAccessibleForFree: false
          }
        }
      })
    ).toBe(true);
  });

  it("detects paywall inside arrays", () => {
    expect(
      hasPaywallFlag([
        { foo: "bar" },
        { isAccessibleForFree: false }
      ])
    ).toBe(true);
  });

  it("returns false when flag is true", () => {
    expect(
      hasPaywallFlag({ isAccessibleForFree: true })
    ).toBe(false);
  });

  it("returns false when flag is missing", () => {
    expect(
      hasPaywallFlag({ "@type": "Recipe" })
    ).toBe(false);
  });
});
