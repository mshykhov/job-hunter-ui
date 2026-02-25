export const JOB_SOURCE = {
  DOU: "DOU",
  DJINNI: "DJINNI",
  INDEED: "INDEED",
} as const;

export type JobSource = (typeof JOB_SOURCE)[keyof typeof JOB_SOURCE];

export const USER_JOB_STATUS = {
  UNSEEN: "UNSEEN",
  REVIEWED: "REVIEWED",
  APPLIED: "APPLIED",
  IRRELEVANT: "IRRELEVANT",
} as const;

export type UserJobStatus = (typeof USER_JOB_STATUS)[keyof typeof USER_JOB_STATUS];

export interface Job {
  id: string;
  title: string;
  company: string;
  url: string;
  description: string;
  source: JobSource;
  salary: string | null;
  location: string | null;
  remote: boolean;
  status: UserJobStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  status?: UserJobStatus;
  source?: JobSource;
  search?: string;
  remote?: boolean;
}
