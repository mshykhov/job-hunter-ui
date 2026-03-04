import { useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { JobFilters, JobSource, PeriodField, UserJobStatus } from "../types";
import { USER_JOB_STATUS, PERIOD_FIELD } from "../types";
import { createStorage } from "@/lib/storage";

const PARAM_KEYS = [
  "sources", "statuses", "search", "remote", "minScore", "since", "periodField", "sortBy",
] as const;

const STATUS_VALUES = new Set<string>(Object.values(USER_JOB_STATUS));
const PERIOD_FIELD_VALUES = new Set<string>(Object.values(PERIOD_FIELD));

const defaultSince = () => new Date(Date.now() - 24 * 3_600_000).toISOString();
const DEFAULT_PERIOD_FIELD = PERIOD_FIELD.MATCHED;
const DEFAULT_FILTERS: JobFilters = { since: defaultSince(), periodField: DEFAULT_PERIOD_FIELD };

const storage = createStorage<JobFilters>("job-hunter-filters", 1, DEFAULT_FILTERS);

const filtersToParams = (filters: JobFilters, params: URLSearchParams): URLSearchParams => {
  for (const key of PARAM_KEYS) params.delete(key);

  if (filters.sources?.length) params.set("sources", filters.sources.join(","));
  if (filters.statuses?.length) params.set("statuses", filters.statuses.join(","));
  if (filters.search) params.set("search", filters.search);
  if (filters.remote) params.set("remote", "true");
  if (filters.minScore != null) params.set("minScore", String(filters.minScore));
  if (filters.since) params.set("since", filters.since);
  if (filters.periodField && filters.periodField !== DEFAULT_PERIOD_FIELD) {
    params.set("periodField", filters.periodField);
  }
  if (filters.sortBy) params.set("sortBy", filters.sortBy);

  return params;
};

const parseFilters = (params: URLSearchParams): JobFilters => {
  const filters: JobFilters = {};

  const sources = params.get("sources");
  if (sources) {
    const parsed = sources.split(",").filter(Boolean) as JobSource[];
    if (parsed.length) filters.sources = parsed;
  }

  const statuses = params.get("statuses");
  if (statuses) {
    const parsed = statuses.split(",").filter((s) => STATUS_VALUES.has(s)) as UserJobStatus[];
    if (parsed.length) filters.statuses = parsed;
  }

  const search = params.get("search");
  if (search) filters.search = search;

  if (params.get("remote") === "true") filters.remote = true;

  const minScore = params.get("minScore");
  if (minScore) filters.minScore = Number(minScore);

  const since = params.get("since");
  if (since) filters.since = since;

  const periodField = params.get("periodField");
  filters.periodField = periodField && PERIOD_FIELD_VALUES.has(periodField)
    ? periodField as PeriodField
    : DEFAULT_PERIOD_FIELD;

  const sortBy = params.get("sortBy");
  if (sortBy) filters.sortBy = sortBy;

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
    (next: JobFilters) => {
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
