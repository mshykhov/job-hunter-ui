import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { JobFilters, JobSource, PeriodField, UserJobStatus } from "../types";
import { JOB_SOURCE, USER_JOB_STATUS, PERIOD_FIELD } from "../types";

const PARAM_KEYS = ["sources", "statuses", "search", "remote", "minScore", "period", "periodField"] as const;

const SOURCE_VALUES = new Set<string>(Object.values(JOB_SOURCE));
const STATUS_VALUES = new Set<string>(Object.values(USER_JOB_STATUS));
const PERIOD_FIELD_VALUES = new Set<string>(Object.values(PERIOD_FIELD));

const DEFAULT_PERIOD = "24h";
const DEFAULT_PERIOD_FIELD = PERIOD_FIELD.MATCHED;

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

export const useJobFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseFilters(searchParams);

  const setFilters = useCallback(
    (next: JobFilters) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          for (const key of PARAM_KEYS) params.delete(key);

          if (next.sources?.length) params.set("sources", next.sources.join(","));
          if (next.statuses?.length) params.set("statuses", next.statuses.join(","));
          if (next.search) params.set("search", next.search);
          if (next.remote) params.set("remote", "true");
          if (next.minScore != null) params.set("minScore", String(next.minScore));
          if (next.period !== undefined) params.set("period", next.period);
          if (next.periodField && next.periodField !== DEFAULT_PERIOD_FIELD) {
            params.set("periodField", next.periodField);
          }

          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { filters, setFilters };
};
