import { useQuery } from "@tanstack/react-query";
import { api, API_PATHS } from "@/lib/api";

export const useJobSources = () => {
  return useQuery({
    queryKey: ["job-sources"],
    queryFn: async () => {
      const { data } = await api.get<string[]>(API_PATHS.PUBLIC_JOB_SOURCES);
      return data;
    },
    staleTime: 300_000,
  });
};
