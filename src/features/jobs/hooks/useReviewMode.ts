import { useCallback, useEffect, useRef,useState } from "react";

import type { JobGroup, JobGroupFilters } from "../types";
import { fetchJobGroupsPage } from "./jobSearchApi";

interface ReviewState {
  jobs: JobGroup[];
  index: number;
  totalElements: number;
  hasMore: boolean;
  nextPage: number;
  filters: JobGroupFilters;
}

const PREFETCH_THRESHOLD = 10;

export interface UseReviewModeReturn {
  isActive: boolean;
  currentJob: JobGroup | null;
  currentIndex: number;
  total: number;
  enter: (jobs: JobGroup[], startJob: JobGroup, totalElements: number, filters: JobGroupFilters, hasMore: boolean, nextPage: number) => void;
  exit: () => void;
  goNext: () => void;
  goPrev: () => void;
  advanceWithUpdate: (updated: JobGroup) => void;
  hasPrev: boolean;
  hasNext: boolean;
  isPageLoading: boolean;
}

export const useReviewMode = (): UseReviewModeReturn => {
  const [state, setState] = useState<ReviewState | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const stateRef = useRef(state);
  const loadingRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const isActive = state !== null;
  const currentJob = state ? (state.jobs[state.index] ?? null) : null;
  const total = state?.totalElements ?? 0;
  const hasPrev = (state?.index ?? 0) > 0;
  const hasNext = state !== null && (state.index < state.jobs.length - 1 || state.hasMore);

  const loadMore = useCallback(async () => {
    const s = stateRef.current;
    if (!s || !s.hasMore || loadingRef.current) return;

    loadingRef.current = true;
    setIsPageLoading(true);
    try {
      const response = await fetchJobGroupsPage(s.filters, s.nextPage);
      setState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          jobs: [...prev.jobs, ...response.content],
          hasMore: response.page + 1 < response.totalPages,
          nextPage: response.page + 1,
        };
      });
    } finally {
      setIsPageLoading(false);
      loadingRef.current = false;
    }
  }, []);

  const enter = useCallback(
    (jobs: JobGroup[], startJob: JobGroup, totalElements: number, filters: JobGroupFilters, hasMore: boolean, nextPage: number) => {
      if (jobs.length === 0) return;
      const index = jobs.findIndex((j) => j.id === startJob.id);
      setState({
        jobs: [...jobs],
        index: Math.max(0, index),
        totalElements,
        hasMore,
        nextPage,
        filters,
      });
    },
    [],
  );

  const exit = useCallback(() => setState(null), []);

  const goNext = useCallback(async () => {
    const s = stateRef.current;
    if (!s) return;

    if (s.index < s.jobs.length - 1) {
      const nextIndex = s.index + 1;
      setState((prev) => prev ? { ...prev, index: nextIndex } : prev);

      if (nextIndex >= s.jobs.length - PREFETCH_THRESHOLD && s.hasMore) {
        loadMore();
      }
      return;
    }

    if (!s.hasMore) return;

    await loadMore();
    setState((prev) => {
      if (!prev || prev.index >= prev.jobs.length - 1) return prev;
      return { ...prev, index: prev.index + 1 };
    });
  }, [loadMore]);

  const goPrev = useCallback(() => {
    setState((prev) => {
      if (!prev || prev.index <= 0) return prev;
      return { ...prev, index: prev.index - 1 };
    });
  }, []);

  const advanceWithUpdate = useCallback((updated: JobGroup) => {
    setState((prev) => {
      if (!prev) return prev;
      const jobs = prev.jobs.map((j) => (j.id === updated.id ? updated : j));
      const nextIndex = prev.index < jobs.length - 1 ? prev.index + 1 : prev.index;
      return { ...prev, jobs, index: nextIndex };
    });
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "ArrowRight" || e.key === "e" || e.key === "E") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "q" || e.key === "Q") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        exit();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, goNext, goPrev, exit]);

  return {
    isActive,
    currentJob,
    currentIndex: state?.index ?? 0,
    total,
    enter,
    exit,
    goNext,
    goPrev,
    advanceWithUpdate,
    hasPrev,
    hasNext,
    isPageLoading,
  };
};
