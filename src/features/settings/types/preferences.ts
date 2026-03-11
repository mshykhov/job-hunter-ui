import type { JobSource } from "@/features/jobs/types";

export interface SearchPreferences {
  categories: string[];
  locations: string[];
  disabledSources: JobSource[];
  remoteOnly: boolean;
}

export interface MatchingPreferences {
  seniorityLevels: string[];
  keywords: string[];
  excludedKeywords: string[];
  excludedTitleKeywords: string[];
  excludedCompanies: string[];
  matchWithAi: boolean;
  customPrompt: string | null;
  weightKeywords: number;
  weightSeniority: number;
  weightCategories: number;
}

export interface TelegramPreferences {
  chatId: string | null;
  username: string | null;
  notificationsEnabled: boolean;
  notificationSources: string[];
}

export interface Preferences {
  about: string | null;
  search: SearchPreferences;
  matching: MatchingPreferences;
  telegram: TelegramPreferences;
}

export const EMPTY_PREFERENCES: Preferences = {
  about: null,
  search: {
    categories: [],
    locations: [],
    disabledSources: [],
    remoteOnly: false,
  },
  matching: {
    seniorityLevels: [],
    keywords: [],
    excludedKeywords: [],
    excludedTitleKeywords: [],
    excludedCompanies: [],
    matchWithAi: true,
    customPrompt: null,
    weightKeywords: 45,
    weightSeniority: 30,
    weightCategories: 25,
  },
  telegram: {
    chatId: null,
    username: null,
    notificationsEnabled: true,
    notificationSources: [],
  },
};

export interface GeneratePreferencesResponse {
  categories: string[];
  seniorityLevels: string[];
  keywords: string[];
  excludedKeywords: string[];
  locations: string[];
  remoteOnly: boolean;
  disabledSources: JobSource[];
}
