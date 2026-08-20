import type { VacancyStatisticsResponse } from "@/features/statistics/types";

export const VACANCY_STATISTICS_MOCK: VacancyStatisticsResponse = {
  from: "2026-08-01T00:00:00Z",
  to: "2026-08-20T23:59:59Z",
  bucket: "DAY",
  exactSince: "2026-08-10T00:00:00Z",
  sourceCoverageSince: "2026-08-12T00:00:00Z",
  points: [
    {
      start: "2026-08-18T00:00:00Z",
      allVacancies: 18,
      coldRejected: 7,
      notFullyRemote: 4,
      aiScored: 7,
      legacyRejectedUnknown: 2,
      medianScore: 72,
    },
    {
      start: "2026-08-19T00:00:00Z",
      allVacancies: 23,
      coldRejected: 8,
      notFullyRemote: 5,
      aiScored: 10,
      legacyRejectedUnknown: 0,
      medianScore: 76,
    },
    {
      start: "2026-08-20T00:00:00Z",
      allVacancies: 14,
      coldRejected: 4,
      notFullyRemote: 3,
      aiScored: 7,
      legacyRejectedUnknown: 0,
      medianScore: 81,
    },
  ],
};
