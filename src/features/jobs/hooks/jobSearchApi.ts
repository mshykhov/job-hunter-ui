import { api, API_PATHS } from "@/lib/api";

import type { JobGroupFilters, PaginatedJobGroupsResponse } from "../types";
import { USER_JOB_SORT } from "../types";

const buildRequestBody = (filters: JobGroupFilters, page: number) => {
  const body: Record<string, unknown> = {};

  if (filters.statuses?.length) body.statuses = filters.statuses;
  if (filters.sources?.length) body.sources = filters.sources;
  if (filters.search) body.search = filters.search;
  if (filters.remote) body.remote = true;
  if (filters.matchedAfter) body.matchedAfter = filters.matchedAfter;
  if (filters.minScore != null) body.minScore = filters.minScore;

  body.page = page;
  body.size = filters.size ?? 50;
  body.sortBy = filters.sortBy ?? USER_JOB_SORT.SCORE;

  return body;
};

export const fetchJobGroupsPage = async (
  filters: JobGroupFilters,
  page: number,
): Promise<PaginatedJobGroupsResponse> => {
  const body = buildRequestBody(filters, page);
  const { data } = await api.post<PaginatedJobGroupsResponse>(API_PATHS.JOBS_SEARCH, body);
  return data;
};
