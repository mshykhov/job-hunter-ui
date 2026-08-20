import { STATISTICS_RANGE } from "./constants";
import { VACANCY_STATS_BUCKET, type VacancyStatsBucket } from "./types";

export const ALL_TIME_START = "1970-01-01T00:00:00.000Z";

export const statisticsRangeStart = (
  range: StatisticsRange,
  now = new Date()
): string | undefined => {
  const days: Record<StatisticsRange, number | undefined> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "1y": 365,
    all: undefined,
    custom: undefined,
  };
  const selectedDays = days[range];
  if (!selectedDays) return undefined;
  const from = new Date(now);
  from.setUTCDate(from.getUTCDate() - selectedDays + 1);
  return from.toISOString();
};

export const statisticsRangeBucket = (range: StatisticsRange): VacancyStatsBucket => {
  if (range === STATISTICS_RANGE.YEAR) return VACANCY_STATS_BUCKET.WEEK;
  if (range === STATISTICS_RANGE.ALL) return VACANCY_STATS_BUCKET.MONTH;
  return VACANCY_STATS_BUCKET.DAY;
};

export type StatisticsRange = (typeof STATISTICS_RANGE)[keyof typeof STATISTICS_RANGE];
