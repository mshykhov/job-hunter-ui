import { useMemo } from "react";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

import type { ExploreFilters } from "@/features/explore/types";
import { api, API_PATHS } from "@/lib/api";

import type { JobGroup, PublicJob, PublicJobPageResponse } from "../types";
import { PUBLIC_JOB_SORT } from "../types";

const fetchPublicJobsPage = async (
  filters: ExploreFilters,
  page: number,
): Promise<PublicJobPageResponse> => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(filters.size ?? 20));
  if (filters.search) params.set("search", filters.search);
  if (filters.remote) params.set("remote", "true");
  if (filters.since) params.set("publishedAfter", filters.since);
  params.set("sortBy", filters.sortBy ?? PUBLIC_JOB_SORT.PUBLISHED);
  filters.sources?.forEach((s) => params.append("sources", s));

  const { data } = await api.get<PublicJobPageResponse>(
    `${API_PATHS.PUBLIC_JOBS}?${params.toString()}`,
  );
  return data;
};

export const usePublicJobs = (filters: ExploreFilters) => {
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

export const mapPublicJobToTableRow = (job: PublicJob): JobGroup => ({
  id: job.id,
  groupId: job.id,
  title: job.title,
  company: job.company,
  sources: [job.source],
  salary: job.salary,
  locations: job.location ? [job.location] : [],
  remote: job.remote ?? false,
  status: "new" as const,
  aiRelevanceScore: null,
  jobCount: 1,
  publishedAt: job.publishedAt,
  matchedAt: null,
  createdAt: null,
  updatedAt: job.scrapedAt,
});
