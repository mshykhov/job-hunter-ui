import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { JobFilters, JobSource, UserJobStatus } from "../types";
import { JOB_SOURCE, USER_JOB_STATUS } from "../types";

const PARAM_KEYS = ["source", "status", "search", "remote", "minScore"] as const;

const SOURCE_VALUES = new Set<string>(Object.values(JOB_SOURCE));
const STATUS_VALUES = new Set<string>(Object.values(USER_JOB_STATUS));

const parseFilters = (params: URLSearchParams): JobFilters => {
  const filters: JobFilters = {};

  const source = params.get("source");
  if (source && SOURCE_VALUES.has(source)) filters.source = source as JobSource;

  const status = params.get("status");
  if (status && STATUS_VALUES.has(status)) filters.status = status as UserJobStatus;

  const search = params.get("search");
  if (search) filters.search = search;

  if (params.get("remote") === "true") filters.remote = true;

  const minScore = params.get("minScore");
  if (minScore != null) {
    const parsed = Number(minScore);
    if (!Number.isNaN(parsed)) filters.minScore = parsed;
  }

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

          if (next.source) params.set("source", next.source);
          if (next.status) params.set("status", next.status);
          if (next.search) params.set("search", next.search);
          if (next.remote) params.set("remote", "true");
          if (next.minScore != null) params.set("minScore", String(next.minScore));

          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { filters, setFilters };
};
