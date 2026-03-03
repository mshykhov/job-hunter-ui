import { api, API_PATHS } from "@/lib/api";
import type { JobFilters, PaginatedJobsResponse } from "../types";
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

  const dateValue = periodToInstant(filters.period);
  if (dateValue) {
    const field = filters.periodField || PERIOD_FIELD.MATCHED;
    const paramName =
      field === PERIOD_FIELD.MATCHED ? "matchedAfter" :
      field === PERIOD_FIELD.PUBLISHED ? "publishedAfter" : "updatedAfter";
    body[paramName] = dateValue;
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
