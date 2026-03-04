import { useMemo } from "react";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type { JobFilters, PublicJob } from "../types";
import { fetchPublicJobsPage } from "./jobSearchApi";

export const usePublicJobs = (filters: JobFilters) => {
  const query = useInfiniteQuery({
    queryKey: ["public-jobs", filters],
    queryFn: ({ pageParam }) => fetchPublicJobsPage(filters, (pageParam as number) ?? 0),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.page + 1 >= lastPage.totalPages) return undefined;
      return allPages.length;
    },
    placeholderData: keepPreviousData,
  });

  const jobs = useMemo(
    () => query.data?.pages.flatMap((p) => p.content) ?? [],
    [query.data],
  );

  const latestPage = query.data?.pages[query.data.pages.length - 1];
  const totalElements = latestPage?.totalElements ?? 0;
  const hasMore = latestPage ? latestPage.page + 1 < latestPage.totalPages : false;

  return {
    jobs,
    totalElements,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isPlaceholderData: query.isPlaceholderData,
    refetch: query.refetch,
    dataUpdatedAt: query.dataUpdatedAt,
    hasNextPage: hasMore,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  } as const;
};

export const mapPublicJobToTableRow = (job: PublicJob) => ({
  id: job.id,
  jobId: job.id,
  title: job.title,
  company: job.company,
  url: job.url,
  source: job.source,
  salary: job.salary,
  location: job.location,
  remote: job.remote ?? false,
  status: "new" as const,
  aiRelevanceScore: null,
  publishedAt: job.publishedAt,
  matchedAt: null,
  updatedAt: null,
});
