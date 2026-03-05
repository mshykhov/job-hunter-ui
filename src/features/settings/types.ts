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

export interface AiConfigForm {
  provider: string | null;
  model: string | null;
  apiKey: string;
}

export const EMPTY_AI_CONFIG: AiConfigForm = {
  provider: null,
  model: null,
  apiKey: "",
};

export interface AiSettingsResponse {
  modelId: string;
  apiKeyHint: string;
}

export interface SaveAiSettingsRequest {
  apiKey: string;
  modelId: string;
}

export interface AiModel {
  id: string;
  name: string;
  inputCostPer1M: number;
  outputCostPer1M: number;
  cachedInputCostPer1M: number | null;
  contextWindow: number;
  recommended: boolean;
}

export interface AiProvider {
  id: string;
  name: string;
  recommended: boolean;
  models: AiModel[];
}

export interface AiProvidersResponse {
  providers: AiProvider[];
}

export interface OutreachSourceConfig {
  coverLetterEnabled: boolean;
  recruiterMessageEnabled: boolean;
  coverLetterPrompt: string | null;
  recruiterMessagePrompt: string | null;
}

export interface OutreachSettings {
  coverLetterPrompt: string | null;
  recruiterMessagePrompt: string | null;
  sourceConfig: Record<string, OutreachSourceConfig>;
  defaultCoverLetterPrompt: string;
  defaultRecruiterMessagePrompt: string;
}

export interface SaveOutreachSettings {
  coverLetterPrompt: string | null;
  recruiterMessagePrompt: string | null;
  sourceConfig: Record<string, OutreachSourceConfig>;
}

export interface OutreachJobInfo {
  id: string;
  title: string;
  company: string | null;
  url: string;
  source: string;
}

export interface CoverLetterResponse {
  coverLetter: string;
  job: OutreachJobInfo;
}

export interface RecruiterMessageResponse {
  recruiterMessage: string;
  job: OutreachJobInfo;
}

export interface OutreachTestRequest {
  source: string;
}

export const EMPTY_OUTREACH_SETTINGS: SaveOutreachSettings = {
  coverLetterPrompt: null,
  recruiterMessagePrompt: null,
  sourceConfig: {},
};
