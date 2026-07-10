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

const FALLBACK_COLORS = ["magenta", "geekblue", "volcano", "gold", "red"];

export const getSourceColor = (source: string): string =>
  KNOWN_SOURCE_COLORS[source.toLowerCase()] ??
  FALLBACK_COLORS[source.length % FALLBACK_COLORS.length];

export const USER_JOB_SORT_LABELS: Record<UserJobSort, string> = {
  SCORE: "Score",
  MATCHED: "Matched",
};

export const PUBLIC_JOB_SORT_LABELS: Record<PublicJobSort, string> = {
  PUBLISHED: "Published",
  SCRAPED: "Scraped",
};
export const [REMOTE_CHECK_COLOR, REMOTE_TAG_COLOR] = ["#52c41a", "lime"] as const;
