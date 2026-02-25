export const JOB_SOURCE = {
  DOU: "dou",
  DJINNI: "djinni",
  LINKEDIN: "linkedin",
} as const;

export type JobSource = (typeof JOB_SOURCE)[keyof typeof JOB_SOURCE];

export const USER_JOB_STATUS = {
  NEW: "new",
  APPLIED: "applied",
  IRRELEVANT: "irrelevant",
} as const;

export type UserJobStatus = (typeof USER_JOB_STATUS)[keyof typeof USER_JOB_STATUS];

export interface Job {
  id: string;
  jobId: string;
  title: string;
  company: string | null;
  url: string;
  source: JobSource;
  salary: string | null;
  location: string | null;
  remote: boolean;
  status: UserJobStatus;
  aiRelevanceScore: number | null;
  publishedAt: string | null;
  matchedAt: string | null;
}

export interface JobDetail extends Job {
  description: string;
  aiReasoning: string | null;
}

export interface JobFilters {
  status?: UserJobStatus;
  source?: JobSource;
  search?: string;
  remote?: boolean;
  minScore?: number;
}
