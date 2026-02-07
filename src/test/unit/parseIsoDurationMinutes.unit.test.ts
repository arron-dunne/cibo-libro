import { describe, it, expect } from "vitest";
import { parseIsoDurationMinutes } from "@/lib/import/helpers";

describe("parseIsoDurationMinutes", () => {
  it("returns undefined for undefined input", () => {
    expect(parseIsoDurationMinutes(undefined)).toBeUndefined();
  });

  it("returns undefined for null input", () => {
    expect(parseIsoDurationMinutes(null)).toBeUndefined();
  });

  it("returns undefined for invalid ISO duration strings", () => {
    expect(parseIsoDurationMinutes("not-a-duration")).toBeUndefined();
    expect(parseIsoDurationMinutes("P")).toBeUndefined();
    expect(parseIsoDurationMinutes("PT")).toBeUndefined();
  });

  it("parses minutes-only durations", () => {
    expect(parseIsoDurationMinutes("PT5M")).toBe(5);
    expect(parseIsoDurationMinutes("PT30M")).toBe(30);
  });

  it("parses hours-only durations", () => {
    expect(parseIsoDurationMinutes("PT1H")).toBe(60);
    expect(parseIsoDurationMinutes("PT2H")).toBe(120);
  });

  it("parses combined hours and minutes durations", () => {
    expect(parseIsoDurationMinutes("PT2H10M")).toBe(130);
    expect(parseIsoDurationMinutes("PT1H45M")).toBe(105);
  });

  it("ignores seconds if present", () => {
    expect(parseIsoDurationMinutes("PT1H30M20S")).toBe(90);
    expect(parseIsoDurationMinutes("PT45S")).toBe(0);
  });
});
