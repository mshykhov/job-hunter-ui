import type { JobSource, UserJobStatus } from "./types";

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

export const formatRelativeDate = (dateStr: string | null): string => {
  if (!dateStr) return "\u2014";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};
