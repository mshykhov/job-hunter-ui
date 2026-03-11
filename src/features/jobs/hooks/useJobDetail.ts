import { useQuery } from "@tanstack/react-query";

import { api, API_PATHS } from "@/lib/api";

import type { JobGroupDetail } from "../types";

export const useJobDetail = (groupId: string | null) => {
  return useQuery({
    queryKey: ["job-detail", groupId],
    queryFn: async () => {
      const { data } = await api.get<JobGroupDetail>(API_PATHS.JOB_GROUP_DETAIL(groupId!));
      return data;
    },
    enabled: !!groupId,
  });
};
