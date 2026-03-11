export type JobSource = string;

export const USER_JOB_STATUS = {
  NEW: "new",
  APPLIED: "applied",
  IRRELEVANT: "irrelevant",
} as const;

export type UserJobStatus = (typeof USER_JOB_STATUS)[keyof typeof USER_JOB_STATUS];

export interface JobGroup {
  id: string;
  groupId: string;
  title: string;
  company: string | null;
  sources: JobSource[];
  locations: string[];
  salary: string | null;
  remote: boolean;
  status: UserJobStatus;
  aiRelevanceScore: number | null;
  jobCount: number;
  publishedAt: string | null;
  matchedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface GroupJob {
  jobId: string;
  url: string;
  source: JobSource;
  description: string;
  salary: string | null;
  location: string | null;
  remote: boolean;
  coverLetter: string | null;
  recruiterMessage: string | null;
  publishedAt: string | null;
  scrapedAt: string | null;
}

export interface JobGroupDetail {
  groupId: string;
  title: string;
  company: string | null;
  remote: boolean;
  status: UserJobStatus;
  aiRelevanceScore: number | null;
  aiReasoning: string | null;
  jobs: GroupJob[];
}

export const USER_JOB_SORT = {
  SCORE: "SCORE",
  MATCHED: "MATCHED",
} as const;

export type UserJobSort = (typeof USER_JOB_SORT)[keyof typeof USER_JOB_SORT];

export const PUBLIC_JOB_SORT = {
  PUBLISHED: "PUBLISHED",
  SCRAPED: "SCRAPED",
} as const;

export type PublicJobSort = (typeof PUBLIC_JOB_SORT)[keyof typeof PUBLIC_JOB_SORT];

export interface JobGroupFilters {
  statuses?: UserJobStatus[];
  search?: string;
  remote?: boolean;
  minScore?: number;
  matchedAfter?: string;
  sortBy?: UserJobSort;
  size?: number;
}

export interface PaginatedJobGroupsResponse {
  content: JobGroup[];
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
