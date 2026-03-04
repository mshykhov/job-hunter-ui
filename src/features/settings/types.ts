import type { JobSource } from "@/features/jobs/types";

export interface Preferences {
  rawInput: string | null;
  categories: string[];
  seniorityLevels: string[];
  keywords: string[];
  excludedKeywords: string[];
  locations: string[];
  languages: string[];
  remoteOnly: boolean;
  disabledSources: JobSource[];
  minScore: number;
  notificationsEnabled: boolean;
}

export const EMPTY_PREFERENCES: Preferences = {
  rawInput: null,
  categories: [],
  seniorityLevels: [],
  keywords: [],
  excludedKeywords: [],
  locations: [],
  languages: [],
  remoteOnly: false,
  disabledSources: [],
  minScore: 50,
  notificationsEnabled: true,
};

export interface AiConfig {
  provider: string | null;
  model: string | null;
  apiKey: string;
}

export const EMPTY_AI_CONFIG: AiConfig = {
  provider: null,
  model: null,
  apiKey: "",
};

export interface AiModel {
  id: string;
  name: string;
  inputCostPer1M: number;
  outputCostPer1M: number;
  cachedInputCostPer1M: number | null;
  contextWindow: number;
}

export interface AiProvider {
  id: string;
  name: string;
  models: AiModel[];
}

export interface AiProvidersResponse {
  providers: AiProvider[];
}
