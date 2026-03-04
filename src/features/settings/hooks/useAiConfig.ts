import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, API_PATHS } from "@/lib/api";
import { EMPTY_AI_CONFIG } from "../types";
import type { AiConfig, AiProvidersResponse } from "../types";

const STORAGE_KEY = "ai-config";

const loadConfig = (): AiConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AiConfig) : EMPTY_AI_CONFIG;
  } catch {
    return EMPTY_AI_CONFIG;
  }
};

export const useAiConfig = () => {
  const [saved, setSaved] = useState<AiConfig>(loadConfig);

  const save = useCallback((config: AiConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setSaved(config);
  }, []);

  return { initial: saved, save };
};

export const useAiProviders = () => {
  return useQuery({
    queryKey: ["ai-providers"],
    queryFn: async () => {
      const { data } = await api.get<AiProvidersResponse>(API_PATHS.AI_PROVIDERS);
      return data.providers;
    },
  });
};
