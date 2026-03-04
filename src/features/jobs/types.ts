export type JobSource = string;

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
  updatedAt: string | null;
}

export interface JobDetail extends Job {
  description: string;
  aiReasoning: string | null;
}

export const PERIOD_FIELD = {
  MATCHED: "matched",
  PUBLISHED: "published",
  UPDATED: "updated",
} as const;

export type PeriodField = (typeof PERIOD_FIELD)[keyof typeof PERIOD_FIELD];

export const USER_JOB_SORT = {
  SCORE: "SCORE",
  PUBLISHED: "PUBLISHED",
  MATCHED: "MATCHED",
  SCRAPED: "SCRAPED",
} as const;

export type UserJobSort = (typeof USER_JOB_SORT)[keyof typeof USER_JOB_SORT];

export const PUBLIC_JOB_SORT = {
  PUBLISHED: "PUBLISHED",
  SCRAPED: "SCRAPED",
} as const;

export type PublicJobSort = (typeof PUBLIC_JOB_SORT)[keyof typeof PUBLIC_JOB_SORT];

export interface JobFilters {
  statuses?: UserJobStatus[];
  sources?: JobSource[];
  search?: string;
  remote?: boolean;
  minScore?: number;
  since?: string;
  periodField?: PeriodField;
  sortBy?: string;
  size?: number;
}

export interface PaginatedJobsResponse {
  content: Job[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  statusCounts: Partial<Record<UserJobStatus, number>>;
}

export interface PublicJob {
  id: string;
  title: string;
  company: string | null;
  url: string;
  description: string;
  source: JobSource;
  salary: string | null;
  location: string | null;
  remote: boolean | null;
  publishedAt: string | null;
  scrapedAt: string | null;
}

export interface PublicJobPageResponse {
  content: PublicJob[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
