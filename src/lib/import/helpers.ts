import { Temporal } from "temporal-polyfill";

// Parse an ISO string into a number of minutes
export function parseIsoDurationMinutes(value: unknown): number | undefined {
  if (typeof value !== "string") return undefined;

  try {
    const duration = Temporal.Duration.from(value);
    const minutes = duration.total({ unit: "minutes" });

    // Guard against NaN / Infinity just in case
    return Number.isFinite(minutes) ? Math.floor(minutes) : undefined;
  } catch {
    return undefined;
  }
}
