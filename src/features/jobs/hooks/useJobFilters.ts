import { useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import { createStorage } from "@/lib/storage";

import type { JobGroupFilters, UserJobSort, UserJobStatus } from "../types";
import { USER_JOB_SORT,USER_JOB_STATUS } from "../types";

const PARAM_KEYS = [
  "statuses", "sources", "search", "remote", "minScore", "matchedAfter", "sortBy",
] as const;

const STATUS_VALUES = new Set<string>(Object.values(USER_JOB_STATUS));
const SORT_VALUES = new Set<string>(Object.values(USER_JOB_SORT));

const defaultMatchedAfter = () => new Date(Date.now() - 24 * 3_600_000).toISOString();
const DEFAULT_FILTERS: JobGroupFilters = { matchedAfter: defaultMatchedAfter() };

const storage = createStorage<JobGroupFilters>("job-hunter-filters", 2, DEFAULT_FILTERS);

const filtersToParams = (filters: JobGroupFilters, params: URLSearchParams): URLSearchParams => {
  for (const key of PARAM_KEYS) params.delete(key);

  if (filters.statuses?.length) params.set("statuses", filters.statuses.join(","));
  if (filters.sources?.length) params.set("sources", filters.sources.join(","));
  if (filters.search) params.set("search", filters.search);
  if (filters.remote) params.set("remote", "true");
  if (filters.minScore != null) params.set("minScore", String(filters.minScore));
  if (filters.matchedAfter) params.set("matchedAfter", filters.matchedAfter);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);

  return params;
};

const parseFilters = (params: URLSearchParams): JobGroupFilters => {
  const filters: JobGroupFilters = {};

  const statuses = params.get("statuses");
  if (statuses) {
    const parsed = statuses.split(",").filter((s) => STATUS_VALUES.has(s)) as UserJobStatus[];
    if (parsed.length) filters.statuses = parsed;
  }

  const sources = params.get("sources");
  if (sources) {
    const parsed = sources.split(",").filter(Boolean);
    if (parsed.length) filters.sources = parsed;
  }

  const search = params.get("search");
  if (search) filters.search = search;

  if (params.get("remote") === "true") filters.remote = true;

  const minScore = params.get("minScore");
  if (minScore) filters.minScore = Number(minScore);

  const matchedAfter = params.get("matchedAfter");
  if (matchedAfter) filters.matchedAfter = matchedAfter;

  const sortBy = params.get("sortBy");
  if (sortBy && SORT_VALUES.has(sortBy)) filters.sortBy = sortBy as UserJobSort;

  return filters;
};

const hasFilterParams = (params: URLSearchParams): boolean =>
  PARAM_KEYS.some((key) => params.has(key));

export const useJobFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const restoredRef = useRef<boolean | null>(null);

  if (restoredRef.current == null) {
    restoredRef.current = true;
    if (!hasFilterParams(searchParams)) {
      const saved = storage.load();
      const params = filtersToParams(saved, new URLSearchParams(searchParams));
      if (hasFilterParams(params)) {
        setSearchParams(params, { replace: true });
      }
    }
  }

  const filters = hasFilterParams(searchParams)
    ? parseFilters(searchParams)
    : storage.load();

  const setFilters = useCallback(
    (next: JobGroupFilters) => {
      storage.save(next);
      setSearchParams(
        (prev) => filtersToParams(next, new URLSearchParams(prev)),
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { filters, setFilters };
};
