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
