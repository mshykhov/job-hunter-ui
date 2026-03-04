import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, API_PATHS } from "@/lib/api";
import type {
  Preferences,
  SearchPreferences,
  MatchingPreferences,
  TelegramPreferences,
  NormalizeResponse,
} from "../types";

const QUERY_KEY = ["preferences"];

export const usePreferences = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await api.get<Preferences>(API_PATHS.PREFERENCES);
      return data;
    },
  });
};

export const useSaveSearchPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (search: SearchPreferences) => {
      const { data } = await api.put<SearchPreferences>(API_PATHS.PREFERENCES_SEARCH, search);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Preferences>(QUERY_KEY, (prev) =>
        prev ? { ...prev, search: data } : undefined,
      );
    },
  });
};

export const useSaveMatchingPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (matching: MatchingPreferences) => {
      const { data } = await api.put<MatchingPreferences>(API_PATHS.PREFERENCES_MATCHING, matching);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Preferences>(QUERY_KEY, (prev) =>
        prev ? { ...prev, matching: data } : undefined,
      );
    },
  });
};

export const useSaveTelegramPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (telegram: TelegramPreferences) => {
      const { data } = await api.put<TelegramPreferences>(API_PATHS.PREFERENCES_TELEGRAM, telegram);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Preferences>(QUERY_KEY, (prev) =>
        prev ? { ...prev, telegram: data } : undefined,
      );
    },
  });
};

export const useNormalizePreferences = () => {
  return useMutation({
    mutationFn: async (rawInput: string) => {
      const { data } = await api.post<NormalizeResponse>(API_PATHS.PREFERENCES_NORMALIZE, { rawInput });
      return data;
    },
  });
};

export const useNormalizeWithFile = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post<NormalizeResponse>(
        API_PATHS.PREFERENCES_NORMALIZE_FILE,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return data;
    },
  });
};
