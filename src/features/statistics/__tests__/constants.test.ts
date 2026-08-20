import { describe, expect, it } from "vitest";

import { STATISTICS_RANGE, statisticsRangeStart } from "../constants";

describe("statisticsRangeStart", () => {
  it("omits the lower bound for the complete history", () => {
    expect(statisticsRangeStart(STATISTICS_RANGE.ALL)).toBeUndefined();
  });

  it("calculates calendar range boundaries", () => {
    expect(statisticsRangeStart(STATISTICS_RANGE.DAYS_7, new Date("2026-08-20T00:00:00Z"))).toBe(
      "2026-08-13T00:00:00.000Z"
    );
  });
});
