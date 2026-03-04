import { useMemo } from "react";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type { JobFilters, UserJobStatus } from "../types";
import { fetchJobsPage } from "./jobSearchApi";

export const useJobs = (filters: JobFilters, refreshInterval: number) => {
  const query = useInfiniteQuery({
    queryKey: ["jobs", filters],
    queryFn: ({ pageParam }) => fetchJobsPage(filters, (pageParam as number) ?? 0),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.page + 1 >= lastPage.totalPages) return undefined;
      return lastPage.page + 1;
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
