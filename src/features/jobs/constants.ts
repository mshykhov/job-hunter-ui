import type { JobSource, PeriodField, UserJobStatus } from "./types";

export const STATUS_COLORS: Record<UserJobStatus, string> = {
  new: "blue",
  applied: "green",
  irrelevant: "default",
};

export const STATUS_LABELS: Record<UserJobStatus, string> = {
  new: "New",
  applied: "Applied",
  irrelevant: "Irrelevant",
};

export const SOURCE_COLORS: Record<JobSource, string> = {
  dou: "orange",
  djinni: "purple",
  linkedin: "cyan",
};

export const PERIOD_OPTIONS = [
  { label: "24h", value: "24h" },
  { label: "3d", value: "3d" },
  { label: "Week", value: "7d" },
  { label: "Month", value: "30d" },
  { label: "All", value: "" },
];

export const PERIOD_FIELD_LABELS: Record<PeriodField, string> = {
  matched: "Matched",
  published: "Published",
  updated: "Scraped",
};

export const formatRelativeDate = (dateStr: string | null): string => {
  if (!dateStr) return "\u2014";
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "<1m ago";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ${hours % 24}h ago`;
  return new Date(dateStr).toLocaleDateString();
};
