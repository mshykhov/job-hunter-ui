import { useState, useCallback, useEffect } from "react";
import type { Job } from "../types";

interface ReviewModeState {
  snapshot: Job[];
  index: number;
}

export interface UseReviewModeReturn {
  isActive: boolean;
  currentJob: Job | null;
  currentIndex: number;
  total: number;
  enter: (jobs: Job[], startJob: Job) => void;
  exit: () => void;
  goNext: () => void;
  goPrev: () => void;
  advanceWithUpdate: (updated: Job) => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const useReviewMode = (): UseReviewModeReturn => {
  const [state, setState] = useState<ReviewModeState | null>(null);

  const isActive = state !== null;
  const currentJob = state ? (state.snapshot[state.index] ?? null) : null;
  const total = state?.snapshot.length ?? 0;
  const hasPrev = (state?.index ?? 0) > 0;
  const hasNext = state !== null && state.index < state.snapshot.length - 1;

  const enter = useCallback((jobs: Job[], startJob: Job) => {
    if (jobs.length === 0) return;
    const index = jobs.findIndex((j) => j.id === startJob.id);
    setState({ snapshot: [...jobs], index: Math.max(0, index) });
  }, []);

  const exit = useCallback(() => setState(null), []);

  const goNext = useCallback(() => {
    setState((prev) => {
      if (!prev || prev.index >= prev.snapshot.length - 1) return prev;
      return { ...prev, index: prev.index + 1 };
    });
  }, []);

  const goPrev = useCallback(() => {
    setState((prev) => {
      if (!prev || prev.index <= 0) return prev;
      return { ...prev, index: prev.index - 1 };
    });
  }, []);

  const advanceWithUpdate = useCallback((updated: Job) => {
    setState((prev) => {
      if (!prev) return prev;
      const snapshot = prev.snapshot.map((j) =>
        j.id === updated.id ? updated : j,
      );
      const nextIndex =
        prev.index < snapshot.length - 1 ? prev.index + 1 : prev.index;
      return { snapshot, index: nextIndex };
    });
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
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
  };
};
