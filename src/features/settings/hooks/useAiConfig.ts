import { useMemo } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, API_PATHS } from "@/lib/api";

import type {
  AiProviderChainEntryForm,
  AiProviderChainResponse,
  AiProvidersResponse,
  SaveAiProviderChainRequest,
} from "../types";

export const useAiProviders = () => {
  return useQuery({
    queryKey: ["ai-providers"],
    queryFn: async () => {
      const { data } = await api.get<AiProvidersResponse>(API_PATHS.AI_PROVIDERS);
      return data.providers;
    },
  });
};

const CHAIN_QUERY_KEY = ["ai-provider-chain"];

export const useAiProviderChain = () => {
  const queryClient = useQueryClient();

  const { data: chain, isLoading } = useQuery({
    queryKey: CHAIN_QUERY_KEY,
    queryFn: async () => {
      const { data } = await api.get<AiProviderChainResponse>(API_PATHS.AI_PROVIDER_CHAIN);
      return data.chain;
    },
  });

  const initial = useMemo(
    (): AiProviderChainEntryForm[] =>
      (chain ?? []).map((entry) => ({
        key: entry.provider,
        provider: entry.provider,
        modelId: entry.modelId,
        apiKey: "",
        enabled: entry.enabled,
      })),
    [chain]
  );

  const storedKeyHints = useMemo(
    (): Record<string, string> =>
      Object.fromEntries((chain ?? []).map((entry) => [entry.provider, entry.apiKeyHint])),
    [chain]
  );

  const save = useMutation({
    mutationFn: async (request: SaveAiProviderChainRequest) => {
      const { data } = await api.put<AiProviderChainResponse>(API_PATHS.AI_PROVIDER_CHAIN, request);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(CHAIN_QUERY_KEY, data.chain);
    },
  });

  return { initial, storedKeyHints, isLoading, save };
};
