import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, API_PATHS } from "@/lib/api";
import type { Preferences } from "../types";

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

export const useSavePreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (preferences: Preferences) => {
      const { data } = await api.put<Preferences>(API_PATHS.PREFERENCES, preferences);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, data);
    },
  });
};

export const useNormalizePreferences = () => {
  return useMutation({
    mutationFn: async (rawInput: string) => {
      const { data } = await api.post<Preferences>(API_PATHS.PREFERENCES_NORMALIZE, { rawInput });
      return data;
    },
  });
};
