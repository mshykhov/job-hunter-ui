import { describe, expect, it } from "vitest";

import { vacancyStatisticsChartOption } from "../chartOptions";

describe("vacancyStatisticsChartOption", () => {
  it("maps decision counts and score to separate axes", () => {
    const option = vacancyStatisticsChartOption([
      {
        start: "2026-08-20T00:00:00Z",
        allVacancies: 14,
        coldRejected: 4,
        notFullyRemote: 3,
        aiScored: 7,
        legacyRejectedUnknown: 2,
        medianScore: 81,
      },
    ]);

    expect(option.yAxis).toHaveLength(2);
    expect(option.dataZoom).toHaveLength(2);
    expect(option.series).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "All vacancies", data: [14] }),
        expect.objectContaining({ name: "Median AI score", yAxisIndex: 1, data: [81] }),
        expect.objectContaining({
          name: "Legacy rejected (unknown)",
          lineStyle: { type: "dashed" },
        }),
      ])
    );
  });
});
