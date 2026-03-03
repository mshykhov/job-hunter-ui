import { useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { JobFilters, JobSource, PeriodField, UserJobStatus } from "../types";
import { JOB_SOURCE, USER_JOB_STATUS, PERIOD_FIELD } from "../types";
import { createStorage } from "@/lib/storage";

const PARAM_KEYS = [
  "sources", "statuses", "search", "remote", "minScore", "period", "periodField",
] as const;

const SOURCE_VALUES = new Set<string>(Object.values(JOB_SOURCE));
const STATUS_VALUES = new Set<string>(Object.values(USER_JOB_STATUS));
const PERIOD_FIELD_VALUES = new Set<string>(Object.values(PERIOD_FIELD));

const DEFAULT_PERIOD = "24h";
const DEFAULT_PERIOD_FIELD = PERIOD_FIELD.MATCHED;
const DEFAULT_FILTERS: JobFilters = { period: DEFAULT_PERIOD, periodField: DEFAULT_PERIOD_FIELD };

const storage = createStorage<JobFilters>("job-hunter-filters", 1, DEFAULT_FILTERS);

const filtersToParams = (filters: JobFilters, params: URLSearchParams): URLSearchParams => {
  for (const key of PARAM_KEYS) params.delete(key);

  if (filters.sources?.length) params.set("sources", filters.sources.join(","));
  if (filters.statuses?.length) params.set("statuses", filters.statuses.join(","));
  if (filters.search) params.set("search", filters.search);
  if (filters.remote) params.set("remote", "true");
  if (filters.minScore != null) params.set("minScore", String(filters.minScore));
  if (filters.period !== undefined) params.set("period", filters.period);
  if (filters.periodField && filters.periodField !== DEFAULT_PERIOD_FIELD) {
    params.set("periodField", filters.periodField);
  }

  return params;
};

const parseFilters = (params: URLSearchParams): JobFilters => {
  const filters: JobFilters = {};

  const sources = params.get("sources");
  if (sources) {
    const parsed = sources.split(",").filter((s) => SOURCE_VALUES.has(s)) as JobSource[];
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
  if (minScore) {
    const parsed = Number(minScore);
    if (!Number.isNaN(parsed)) filters.minScore = parsed;
  }

  filters.period = params.get("period") ?? DEFAULT_PERIOD;

  const periodField = params.get("periodField");
  filters.periodField = periodField && PERIOD_FIELD_VALUES.has(periodField)
    ? periodField as PeriodField
    : DEFAULT_PERIOD_FIELD;

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

  const filters = parseFilters(searchParams);

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
