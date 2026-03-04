import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, API_PATHS } from "@/lib/api";
import { EMPTY_PREFERENCES } from "../types";
import type {
  Preferences,
  SearchPreferences,
  MatchingPreferences,
  TelegramPreferences,
  NormalizeResponse,
} from "../types";
import type { JobSource } from "@/features/jobs/types";

const QUERY_KEY = ["preferences"];

interface LegacyPreferences {
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

type ApiResponse = Preferences | LegacyPreferences;

const isNested = (data: ApiResponse): data is Preferences =>
  "search" in data && typeof data.search === "object" && data.search !== null;

const mapResponse = (data: ApiResponse): Preferences => {
  if (isNested(data)) return data;

  return {
    search: {
      rawInput: data.rawInput,
      categories: data.categories,
      seniorityLevels: data.seniorityLevels,
      locations: data.locations,
      remoteOnly: data.remoteOnly,
    },
    matching: {
      ...EMPTY_PREFERENCES.matching,
      keywords: data.keywords,
      excludedKeywords: data.excludedKeywords,
      disabledSources: data.disabledSources,
      minScore: data.minScore,
    },
    telegram: {
      ...EMPTY_PREFERENCES.telegram,
      notificationsEnabled: data.notificationsEnabled,
    },
  };
};

export const usePreferences = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse>(API_PATHS.PREFERENCES);
      return mapResponse(data);
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
