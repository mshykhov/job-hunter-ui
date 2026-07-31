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
  requiresApiKey: boolean;
  models: AiModel[];
}

export interface AiProvidersResponse {
  providers: AiProvider[];
}

export interface AiProviderChainEntry {
  priority: number;
  provider: string;
  modelId: string;
  apiKeyHint: string;
  enabled: boolean;
}

export interface AiProviderChainResponse {
  chain: AiProviderChainEntry[];
}

export interface SaveAiProviderChainEntryRequest {
  priority: number;
  provider: string;
  modelId: string;
  apiKey?: string;
  enabled: boolean;
}

export interface SaveAiProviderChainRequest {
  chain: SaveAiProviderChainEntryRequest[];
}

export interface AiProviderChainEntryForm {
  key: string;
  provider: string | null;
  modelId: string | null;
  apiKey: string;
  enabled: boolean;
}

export const createChainEntry = (): AiProviderChainEntryForm => ({
  key: crypto.randomUUID(),
  provider: null,
  modelId: null,
  apiKey: "",
  enabled: true,
});
