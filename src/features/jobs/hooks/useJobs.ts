import { useMemo } from "react";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type { JobFilters, UserJobStatus } from "../types";
import { fetchJobsPage, type Cursor } from "./jobSearchApi";

export const useJobs = (filters: JobFilters, refreshInterval: number) => {
  const query = useInfiniteQuery({
    queryKey: ["jobs", filters],
    queryFn: ({ pageParam }) => fetchJobsPage(filters, pageParam),
    initialPageParam: undefined as Cursor | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore || lastPage.content.length === 0) return undefined;
      const lastJob = lastPage.content[lastPage.content.length - 1];
      return { createdAt: lastJob.matchedAt!, id: lastJob.id };
    },
    refetchInterval: refreshInterval || false,
    placeholderData: keepPreviousData,
  });

  const jobs = useMemo(
    () => query.data?.pages.flatMap((p) => p.content) ?? [],
    [query.data],
  );

  const latestPage = query.data?.pages[query.data.pages.length - 1];
  const statusCounts: Partial<Record<UserJobStatus, number>> = latestPage?.statusCounts ?? {};
  const totalElements = latestPage?.totalElements ?? 0;

  return {
    ...query,
    jobs,
    statusCounts,
    totalElements,
  };
};
