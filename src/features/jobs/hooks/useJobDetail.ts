import { useQuery } from "@tanstack/react-query";
import { api, API_PATHS } from "@/lib/api";
import type { JobDetail } from "../types";

export const useJobDetail = (jobId: string | null) => {
  return useQuery({
    queryKey: ["job-detail", jobId],
    queryFn: async () => {
      const { data } = await api.get<JobDetail>(API_PATHS.JOB_DETAIL(jobId!));
      return data;
    },
    enabled: !!jobId,
  });
};
