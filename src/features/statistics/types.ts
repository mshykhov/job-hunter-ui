export const VACANCY_STATS_BUCKET = {
  DAY: "DAY",
  WEEK: "WEEK",
  MONTH: "MONTH",
} as const;

export type VacancyStatsBucket = (typeof VACANCY_STATS_BUCKET)[keyof typeof VACANCY_STATS_BUCKET];

export interface VacancyStatisticsQuery {
  from?: string;
  to?: string;
  bucket: VacancyStatsBucket;
  sources?: string[];
}

export interface VacancyStatisticsPoint {
  start: string;
  allVacancies: number;
  coldRejected: number;
  notFullyRemote: number;
  aiScored: number;
  legacyRejectedUnknown: number;
  medianScore: number | null;
}

export interface VacancyStatisticsResponse {
  from: string;
  to: string;
  bucket: VacancyStatsBucket;
  exactSince: string | null;
  sourceCoverageSince: string | null;
  points: VacancyStatisticsPoint[];
}
