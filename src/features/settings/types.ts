import type { JobSource } from "@/features/jobs/types";

export interface SearchPreferences {
  rawInput: string | null;
  categories: string[];
  seniorityLevels: string[];
  locations: string[];
  remoteOnly: boolean;
}

export interface MatchingPreferences {
  keywords: string[];
  excludedKeywords: string[];
  excludedTitleKeywords: string[];
  excludedCompanies: string[];
  disabledSources: JobSource[];
  minScore: number;
  matchWithAi: boolean;
  customPrompt: string | null;
}

export interface TelegramPreferences {
  chatId: string | null;
  username: string | null;
  notificationsEnabled: boolean;
  notificationSources: string[];
}

export interface Preferences {
  search: SearchPreferences;
  matching: MatchingPreferences;
  telegram: TelegramPreferences;
}

export const EMPTY_PREFERENCES: Preferences = {
  search: {
    rawInput: null,
    categories: [],
    seniorityLevels: [],
    locations: [],
    remoteOnly: false,
  },
  matching: {
    keywords: [],
    excludedKeywords: [],
    excludedTitleKeywords: [],
    excludedCompanies: [],
    disabledSources: [],
    minScore: 50,
    matchWithAi: true,
    customPrompt: null,
  },
  telegram: {
    chatId: null,
    username: null,
    notificationsEnabled: true,
    notificationSources: [],
  },
};

export interface NormalizeResponse {
  rawInput: string;
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
