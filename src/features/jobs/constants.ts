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
  indeed: "blue",
  linkedin: "cyan",
};
