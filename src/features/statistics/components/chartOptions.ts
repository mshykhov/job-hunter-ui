import type { EChartsOption } from "echarts";

import type { VacancyStatisticsPoint } from "../types";

export const vacancyStatisticsChartOption = (
  points: VacancyStatisticsPoint[],
  exactSince: string | null
): EChartsOption => ({
  animation: false,
  aria: {
    enabled: true,
    description: "Vacancy history with daily decision counts and median AI score.",
  },
  tooltip: { trigger: "axis", confine: true },
  legend: { top: 0, type: "scroll" },
  grid: { left: 52, right: 52, top: 48, bottom: 78 },
  xAxis: { type: "time" },
  yAxis: [
    { type: "value", name: "Vacancies", minInterval: 1 },
    { type: "value", name: "Score", min: 0, max: 100 },
  ],
  dataZoom: [{ type: "inside" }, { type: "slider", bottom: 18 }],
  series: [
    {
      name: "All vacancies",
      type: "line",
      data: points.map((point) => [point.start, point.allVacancies]),
      smooth: true,
    },
    {
      name: "Cold rejected",
      type: "line",
      data: points.map((point) => [
        point.start,
        beforeExact(point.start, exactSince) ? null : point.coldRejected,
      ]),
      smooth: true,
      markLine: exactSince ? { data: [{ xAxis: exactSince, name: "Exact decisions" }] } : undefined,
    },
    {
      name: "Not fully remote",
      type: "line",
      data: points.map((point) => [
        point.start,
        beforeExact(point.start, exactSince) ? null : point.notFullyRemote,
      ]),
      smooth: true,
    },
    {
      name: "AI scored",
      type: "line",
      data: points.map((point) => [point.start, point.aiScored]),
      smooth: true,
    },
    {
      name: "Legacy rejected (unknown)",
      type: "line",
      data: points.map((point) => [
        point.start,
        beforeExact(point.start, exactSince) ? point.legacyRejectedUnknown : null,
      ]),
      lineStyle: { type: "dashed" },
      smooth: true,
    },
    {
      name: "Median AI score",
      type: "line",
      yAxisIndex: 1,
      data: points.map((point) => [point.start, point.medianScore]),
      smooth: true,
    },
  ],
});

const beforeExact = (start: string, exactSince: string | null) =>
  !!exactSince && start < exactSince;
