export const MATCHED_RANGES = [
  { value: "1h", label: "Last 1h" },
  { value: "12h", label: "Last 12h" },
  { value: "24h", label: "Last 24h" },
  { value: "3d", label: "Last 3 days" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "all", label: "All time" },
] as const;

export const DEFAULT_MATCHED_RANGE = "24h";

const RANGE_MS: Record<string, number> = {
  "1h": 3_600_000,
  "12h": 12 * 3_600_000,
  "24h": 24 * 3_600_000,
  "3d": 3 * 86_400_000,
  "7d": 7 * 86_400_000,
  "30d": 30 * 86_400_000,
};

const MINUTE = 60_000;

/**
 * Rolling window: recomputed from "now" on every call, rounded down to the minute so
 * the query key stays stable within a minute and rolls forward on each refresh.
 * Returns undefined for "all" (no lower bound).
 */
export const rangeToMatchedAfter = (token: string | undefined): string | undefined => {
  if (!token || token === "all") return undefined;
  const ms = RANGE_MS[token] ?? RANGE_MS[DEFAULT_MATCHED_RANGE];
  const nowMinute = Math.floor(Date.now() / MINUTE) * MINUTE;
  return new Date(nowMinute - ms).toISOString();
};
