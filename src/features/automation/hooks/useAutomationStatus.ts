import { useQuery } from "@tanstack/react-query";

import { api, API_PATHS } from "@/lib/api";

import type { AutomationStatus } from "../types";

const QUERY_KEY = ["automation", "status"] as const;

export const useAutomationStatus = () => {
  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await api.get<AutomationStatus>(API_PATHS.AUTOMATION_STATUS, {
        skipErrorHandler: true,
      });
      return data;
    },
    refetchInterval: 30_000,
  });

  return { data: query.data, isLoading: query.isLoading, error: query.error };
};
