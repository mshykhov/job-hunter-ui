import { useMemo } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, API_PATHS, isAxiosError } from "@/lib/api";

import type {
  AiConfigForm,
  AiProvider,
  AiProvidersResponse,
  AiSettingsResponse,
} from "../types";
import { EMPTY_AI_CONFIG } from "../types";

export const useAiProviders = () => {
  return useQuery({
    queryKey: ["ai-providers"],
    queryFn: async () => {
      const { data } = await api.get<AiProvidersResponse>(API_PATHS.AI_PROVIDERS);
      return data.providers;
    },
  });
};

const deriveProvider = (
  modelId: string,
  providers: AiProvider[],
): string | null => {
  const provider = providers.find((p) =>
    p.models.some((m) => m.id === modelId),
  );
  return provider?.id ?? null;
};

export const useAiSettings = () => {
  return useQuery<AiSettingsResponse | null>({
    queryKey: ["ai-settings"],
    queryFn: async () => {
      try {
        const { data } = await api.get<AiSettingsResponse>(API_PATHS.AI_SETTINGS, {
          skipErrorHandler: true,
        });
        return data;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });
};

export const useAiConfig = (providers: AiProvider[] | undefined) => {
  const queryClient = useQueryClient();
  const { data: settings, isLoading: settingsLoading } = useAiSettings();

  const initial = useMemo((): AiConfigForm => {
    if (!settings || !providers) return EMPTY_AI_CONFIG;
    return {
      provider: deriveProvider(settings.modelId, providers),
      model: settings.modelId,
      apiKey: "",
    };
  }, [settings, providers]);

  const apiKeyHint = settings?.apiKeyHint ?? null;

  const saveMutation = useMutation({
    mutationFn: async (form: AiConfigForm) => {
      const { data } = await api.put<AiSettingsResponse>(API_PATHS.AI_SETTINGS, {
        apiKey: form.apiKey,
        modelId: form.model,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-settings"] });
    },
  });

  return { initial, apiKeyHint, settingsLoading, save: saveMutation };
};
