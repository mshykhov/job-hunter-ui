import { useQuery } from "@tanstack/react-query";

import { api, API_PATHS } from "@/lib/api";

import type { VacancyStatisticsQuery, VacancyStatisticsResponse } from "../types";

export const vacancyStatisticsQueryKey = (query: VacancyStatisticsQuery) =>
  ["statistics", "vacancies", query] as const;

export const useVacancyStatistics = (query: VacancyStatisticsQuery) => {
  const result = useQuery({
    queryKey: vacancyStatisticsQueryKey(query),
    queryFn: async () => {
      const { data } = await api.post<VacancyStatisticsResponse>(
        API_PATHS.VACANCY_STATISTICS,
        query,
        {
          skipErrorHandler: true,
        }
      );
      return data;
    },
  });

  return { data: result.data, isLoading: result.isLoading, error: result.error };
};
