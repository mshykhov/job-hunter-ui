import { describe, expect, it } from "vitest";

import { VACANCY_STATS_BUCKET } from "../../types";
import { vacancyStatisticsChartOption } from "../chartOptions";

describe("vacancyStatisticsChartOption", () => {
  it("maps decision counts and score to separate axes", () => {
    const option = vacancyStatisticsChartOption(
      [
        {
          start: "2026-08-20T00:00:00Z",
          allVacancies: 14,
          coldRejected: 4,
          notFullyRemote: 3,
          aiScored: 7,
          legacyRejectedUnknown: 2,
          medianScore: 81,
        },
      ],
      null,
      VACANCY_STATS_BUCKET.DAY
    );

    expect(option.yAxis).toHaveLength(2);
    expect(option.dataZoom).toHaveLength(2);
    expect(option.xAxis).toEqual(
      expect.objectContaining({ type: "time", minInterval: 24 * 60 * 60 * 1000 })
    );
    expect(option.series).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "All vacancies", data: [["2026-08-20T00:00:00Z", 14]] }),
        expect.objectContaining({
          name: "Median AI score",
          yAxisIndex: 1,
          data: [["2026-08-20T00:00:00Z", 81]],
        }),
        expect.objectContaining({
          name: "Legacy rejected (unknown)",
          lineStyle: { type: "dashed" },
        }),
      ])
    );
  });

  it("keeps incomplete decision categories out of the exact period", () => {
    const option = vacancyStatisticsChartOption(
      [
        {
          start: "2026-08-09T00:00:00Z",
          allVacancies: 1,
          coldRejected: 1,
          notFullyRemote: 1,
          aiScored: 1,
          legacyRejectedUnknown: 1,
          medianScore: null,
        },
        {
          start: "2026-08-10T00:00:00Z",
          allVacancies: 1,
          coldRejected: 1,
          notFullyRemote: 1,
          aiScored: 1,
          legacyRejectedUnknown: 0,
          medianScore: null,
        },
      ],
      "2026-08-10T00:00:00Z",
      VACANCY_STATS_BUCKET.DAY
    );
    const series = option.series as {
      name: string;
      data: [string, number | null][];
      markLine?: unknown;
    }[];
    expect(series.find((item) => item.name === "Cold rejected")?.data[0]).toEqual([
      "2026-08-09T00:00:00Z",
      null,
    ]);
    expect(series.find((item) => item.name === "Cold rejected")?.markLine).toBeDefined();
    expect(series.find((item) => item.name === "Legacy rejected (unknown)")?.data).toEqual([
      ["2026-08-09T00:00:00Z", 1],
      ["2026-08-10T00:00:00Z", null],
    ]);
  });
});
