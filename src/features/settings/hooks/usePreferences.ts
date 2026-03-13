import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, API_PATHS } from "@/lib/api";

import type {
  GeneratePreferencesResponse,
  MatchingPreferences,
  Preferences,
  SearchPreferences,
  TelegramPreferences,
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

export const useSaveAbout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (about: string) => {
      await api.put(API_PATHS.PREFERENCES_ABOUT, { about });
      return about;
    },
    onSuccess: (about) => {
      queryClient.setQueryData<Preferences>(QUERY_KEY, (prev) =>
        prev ? { ...prev, about } : undefined,
      );
    },
  });
};

export const useUploadAbout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.put<{ about: string }>(
        API_PATHS.PREFERENCES_ABOUT_FILE,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return data.about;
    },
    onSuccess: (about) => {
      queryClient.setQueryData<Preferences>(QUERY_KEY, (prev) =>
        prev ? { ...prev, about } : undefined,
      );
    },
  });
};

export const useGeneratePreferences = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<GeneratePreferencesResponse>(API_PATHS.PREFERENCES_GENERATE);
      return data;
    },
  });
};

export const useOptimizeAbout = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ about: string }>(API_PATHS.PREFERENCES_ABOUT_OPTIMIZE);
      return data.about;
    },
  });
};
