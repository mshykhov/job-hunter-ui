import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api, API_PATHS } from "@/lib/api";

import type { JobGroup, UserJobStatus } from "../types";

interface UpdateStatusParams {
  groupId: string;
  status: UserJobStatus;
}

const updateGroupStatus = async ({ groupId, status }: UpdateStatusParams): Promise<JobGroup> => {
  const { data } = await api.patch<JobGroup>(API_PATHS.JOB_GROUP_STATUS(groupId), { status });
  return data;
};

export const useJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGroupStatus,
    onSuccess: (_data, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job-detail", groupId] });
    },
  });
};
