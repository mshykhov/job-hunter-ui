import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, API_PATHS } from "@/lib/api";
import type { Job, JobFilters, UserJobStatus } from "../types";
import { PERIOD_FIELD } from "../types";

const PERIOD_MS: Record<string, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "3d": 3 * 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

const periodToInstant = (period?: string): string | undefined => {
  if (!period) return undefined;
  const ms = PERIOD_MS[period];
  if (!ms) return undefined;
  return new Date(Date.now() - ms).toISOString();
};

const buildApiParams = (filters: JobFilters): Record<string, string> => {
  const params: Record<string, string> = {};
  if (filters.minScore != null) params.minScore = String(filters.minScore);
  if (filters.sources?.length) params.sources = filters.sources.join(",");

  const dateValue = periodToInstant(filters.period);
  if (dateValue) {
    const field = filters.periodField || PERIOD_FIELD.MATCHED;
    const paramName =
      field === PERIOD_FIELD.MATCHED ? "matchedAfter" :
      field === PERIOD_FIELD.PUBLISHED ? "publishedAfter" : "updatedAfter";
    params[paramName] = dateValue;
  }

  return params;
};

const fetchJobs = async (filters: JobFilters): Promise<Job[]> => {
  const params = buildApiParams(filters);
  const { data } = await api.get<Job[]>(API_PATHS.JOBS, { params });
  return data;
};

export const useJobs = (filters: JobFilters, refreshInterval: number) => {
  const apiKey = useMemo(
    () => ({
      minScore: filters.minScore,
      sources: filters.sources,
      period: filters.period,
      periodField: filters.periodField,
    }),
    [filters.minScore, filters.sources, filters.period, filters.periodField],
  );

  return useQuery({
    queryKey: ["jobs", apiKey],
    queryFn: () => fetchJobs(filters),
    refetchInterval: refreshInterval || false,
  });
};

const sortByPublishedDesc = (a: Job, b: Job): number => {
  const dateA = a.publishedAt ?? a.matchedAt ?? "";
  const dateB = b.publishedAt ?? b.matchedAt ?? "";
  return dateB.localeCompare(dateA);
};

export const filterJobsLocally = (jobs: Job[], filters: JobFilters): Job[] => {
  return jobs
    .filter((job) => {
      if (filters.statuses?.length && !filters.statuses.includes(job.status)) return false;
      if (filters.sources?.length && !filters.sources.includes(job.source)) return false;
      if (filters.remote && !job.remote) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !job.title.toLowerCase().includes(q) &&
          !(job.company?.toLowerCase().includes(q)) &&
          !(job.location?.toLowerCase().includes(q)) &&
          !(job.salary?.toLowerCase().includes(q))
        ) return false;
      }
      return true;
    })
    .sort(sortByPublishedDesc);
};

export const countByStatus = (jobs: Job[]): Partial<Record<UserJobStatus, number>> => {
  return jobs.reduce(
    (acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    },
    {} as Partial<Record<UserJobStatus, number>>
  );
};
