import { VACANCY_STATS_BUCKET, type VacancyStatsBucket } from "./types";

export const STATISTICS_RANGE = {
  DAYS_7: "7d",
  DAYS_30: "30d",
  DAYS_90: "90d",
  YEAR: "1y",
  ALL: "all",
} as const;

export type StatisticsRange = (typeof STATISTICS_RANGE)[keyof typeof STATISTICS_RANGE];

export const STATISTICS_RANGE_OPTIONS: { value: StatisticsRange; label: string }[] = [
  { value: STATISTICS_RANGE.DAYS_7, label: "7D" },
  { value: STATISTICS_RANGE.DAYS_30, label: "30D" },
  { value: STATISTICS_RANGE.DAYS_90, label: "90D" },
  { value: STATISTICS_RANGE.YEAR, label: "1Y" },
  { value: STATISTICS_RANGE.ALL, label: "All" },
];

export const STATISTICS_BUCKET_OPTIONS: { value: VacancyStatsBucket; label: string }[] = [
  { value: VACANCY_STATS_BUCKET.DAY, label: "Day" },
  { value: VACANCY_STATS_BUCKET.WEEK, label: "Week" },
  { value: VACANCY_STATS_BUCKET.MONTH, label: "Month" },
];

export const statisticsRangeStart = (
  range: StatisticsRange,
  now = new Date()
): string | undefined => {
  const days: Record<StatisticsRange, number | undefined> = {
    [STATISTICS_RANGE.DAYS_7]: 7,
    [STATISTICS_RANGE.DAYS_30]: 30,
    [STATISTICS_RANGE.DAYS_90]: 90,
    [STATISTICS_RANGE.YEAR]: 365,
    [STATISTICS_RANGE.ALL]: undefined,
  };
  const selectedDays = days[range];
  if (!selectedDays) return undefined;
  const from = new Date(now);
  from.setUTCDate(from.getUTCDate() - selectedDays);
  return from.toISOString();
};
