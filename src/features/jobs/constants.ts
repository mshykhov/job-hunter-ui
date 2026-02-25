import type { JobSource, UserJobStatus } from "./types";

export const STATUS_COLORS: Record<UserJobStatus, string> = {
  UNSEEN: "blue",
  REVIEWED: "cyan",
  APPLIED: "green",
  IRRELEVANT: "default",
};

export const STATUS_LABELS: Record<UserJobStatus, string> = {
  UNSEEN: "New",
  REVIEWED: "Reviewed",
  APPLIED: "Applied",
  IRRELEVANT: "Irrelevant",
};

export const SOURCE_COLORS: Record<JobSource, string> = {
  DOU: "orange",
  DJINNI: "purple",
  INDEED: "blue",
};
