import type { EChartsOption } from "echarts";

import type { VacancyStatisticsPoint } from "../types";

export const vacancyStatisticsChartOption = (points: VacancyStatisticsPoint[]): EChartsOption => ({
  animation: false,
  tooltip: { trigger: "axis" },
  legend: { top: 0, type: "scroll" },
  grid: { left: 52, right: 52, top: 48, bottom: 78 },
  xAxis: { type: "category", data: points.map((point) => point.start), boundaryGap: false },
  yAxis: [
    { type: "value", name: "Vacancies", minInterval: 1 },
    { type: "value", name: "Score", min: 0, max: 100 },
  ],
  dataZoom: [{ type: "inside" }, { type: "slider", bottom: 18 }],
  series: [
    {
      name: "All vacancies",
      type: "line",
      data: points.map((point) => point.allVacancies),
      smooth: true,
    },
    {
      name: "Cold rejected",
      type: "line",
      data: points.map((point) => point.coldRejected),
      smooth: true,
    },
    {
      name: "Not fully remote",
      type: "line",
      data: points.map((point) => point.notFullyRemote),
      smooth: true,
    },
    { name: "AI scored", type: "line", data: points.map((point) => point.aiScored), smooth: true },
    {
      name: "Legacy rejected (unknown)",
      type: "line",
      data: points.map((point) => point.legacyRejectedUnknown),
      lineStyle: { type: "dashed" },
      smooth: true,
    },
    {
      name: "Median AI score",
      type: "line",
      yAxisIndex: 1,
      data: points.map((point) => point.medianScore),
      smooth: true,
    },
  ],
});
