import type { JobSource } from "@/features/jobs/types";

export interface Preferences {
  rawInput: string | null;
  categories: string[];
  seniorityLevels: string[];
  keywords: string[];
  excludedKeywords: string[];
  remoteOnly: boolean;
  enabledSources: JobSource[];
  notificationsEnabled: boolean;
}
