import type { GroupJob } from "../types";

export const getScoreClass = (score: number): string => {
  if (score >= 70) return "job-detail-score--high";
  if (score >= 40) return "job-detail-score--medium";
  return "job-detail-score--low";
};

export const getScoreLabel = (score: number): string => {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
};

export const sortJobsByDate = (jobs: GroupJob[]): GroupJob[] =>
  [...jobs].sort((a, b) => {
    const dateA = a.publishedAt ?? a.scrapedAt ?? "";
    const dateB = b.publishedAt ?? b.scrapedAt ?? "";
    return dateB.localeCompare(dateA);
  });
