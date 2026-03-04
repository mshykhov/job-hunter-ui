import { api, API_PATHS } from "@/lib/api";
import type { JobFilters, PaginatedJobsResponse, PublicJobPageResponse } from "../types";
import { PERIOD_FIELD } from "../types";


export interface Cursor {
  createdAt: string;
  id: string;
}

const buildRequestBody = (filters: JobFilters, cursor?: Cursor) => {
  const body: Record<string, unknown> = {};

  if (filters.minScore != null) body.minScore = filters.minScore;
  if (filters.sources?.length) body.sources = filters.sources;
  if (filters.statuses?.length) body.statuses = filters.statuses;
  if (filters.search) body.search = filters.search;
  if (filters.remote) body.remote = true;

  if (filters.since) {
    const field = filters.periodField || PERIOD_FIELD.MATCHED;
    const paramName =
      field === PERIOD_FIELD.MATCHED ? "matchedAfter" :
      field === PERIOD_FIELD.PUBLISHED ? "publishedAfter" : "updatedAfter";
    body[paramName] = filters.since;
  }

  body.size = filters.size ?? 50;

  if (cursor) {
    body.cursorCreatedAt = cursor.createdAt;
    body.cursorId = cursor.id;
  }

  return body;
};

export const fetchJobsPage = async (
  filters: JobFilters,
  cursor?: Cursor,
): Promise<PaginatedJobsResponse> => {
  const body = buildRequestBody(filters, cursor);
  const { data } = await api.post<PaginatedJobsResponse>(API_PATHS.JOBS_SEARCH, body);
  return data;
};

export const fetchPublicJobsPage = async (
  filters: JobFilters,
  page: number,
): Promise<PublicJobPageResponse> => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(filters.size ?? 20));
  if (filters.search) params.set("search", filters.search);
  if (filters.remote) params.set("remote", "true");
  filters.sources?.forEach((s) => params.append("source", s));

  const { data } = await api.get<PublicJobPageResponse>(
    `${API_PATHS.PUBLIC_JOBS}?${params.toString()}`,
  );
  return data;
};
