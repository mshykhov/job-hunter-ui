import { useQuery } from "@tanstack/react-query";
import { api, API_PATHS } from "@/lib/api";
import type { Job, JobFilters, UserJobStatus } from "../types";

const fetchJobs = async (filters: JobFilters): Promise<Job[]> => {
  const params: Record<string, string> = {};
  if (filters.status) params.status = filters.status;

  const { data } = await api.get<Job[]>(API_PATHS.JOBS, { params });
  return data;
};

export const useJobs = (filters: JobFilters, refreshInterval: number) => {
  return useQuery({
    queryKey: ["jobs", filters],
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
      if (filters.source && job.source !== filters.source) return false;
      if (filters.remote && !job.remote) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company?.toLowerCase().includes(q) ?? false;
        if (!matchesTitle && !matchesCompany) return false;
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
