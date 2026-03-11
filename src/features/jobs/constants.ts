import type { PublicJobSort, UserJobSort, UserJobStatus } from "./types";

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

const KNOWN_SOURCE_COLORS: Record<string, string> = {
  dou: "orange",
  djinni: "purple",
  linkedin: "cyan",
};

const FALLBACK_COLORS = ["magenta", "geekblue", "volcano", "gold", "lime"];

export const getSourceColor = (source: string): string =>
  KNOWN_SOURCE_COLORS[source.toLowerCase()] ?? FALLBACK_COLORS[source.length % FALLBACK_COLORS.length];

export const USER_JOB_SORT_LABELS: Record<UserJobSort, string> = {
  SCORE: "Score",
  MATCHED: "Matched",
};

export const PUBLIC_JOB_SORT_LABELS: Record<PublicJobSort, string> = {
  PUBLISHED: "Published",
  SCRAPED: "Scraped",
};

export const REMOTE_CHECK_COLOR = "#52c41a";

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
