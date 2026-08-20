import type { EChartsOption } from "echarts";

import {
  VACANCY_STATS_BUCKET,
  type VacancyStatisticsPoint,
  type VacancyStatsBucket,
} from "../types";

export const vacancyStatisticsChartOption = (
  points: VacancyStatisticsPoint[],
  exactSince: string | null,
  bucket: VacancyStatsBucket
): EChartsOption => ({
  animation: false,
  aria: {
    enabled: true,
    description: "Vacancy history with daily decision counts and median AI score.",
  },
  tooltip: { trigger: "axis", confine: true },
  legend: { top: 0, left: 0, right: 0, type: "scroll" },
  grid: { left: 48, right: 48, top: 72, bottom: 78 },
  xAxis: {
    type: "time",
    minInterval: bucketInterval(bucket),
    axisLabel: {
      formatter: (value: number) => formatBucketLabel(value, bucket),
      hideOverlap: true,
    },
  },
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

const bucketInterval = (bucket: VacancyStatsBucket) => {
  if (bucket === VACANCY_STATS_BUCKET.MONTH) return 28 * 24 * 60 * 60 * 1000;
  if (bucket === VACANCY_STATS_BUCKET.WEEK) return 7 * 24 * 60 * 60 * 1000;
  return 24 * 60 * 60 * 1000;
};

const formatBucketLabel = (value: number, bucket: VacancyStatsBucket) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    ...(bucket === VACANCY_STATS_BUCKET.MONTH ? { year: "2-digit" } : { day: "numeric" }),
    timeZone: "UTC",
  }).format(date);
};
