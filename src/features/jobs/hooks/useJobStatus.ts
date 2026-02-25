import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, API_PATHS } from "@/lib/api";
import type { Job, UserJobStatus } from "../types";

interface UpdateStatusParams {
  jobId: string;
  status: UserJobStatus;
}

const updateJobStatus = async ({ jobId, status }: UpdateStatusParams): Promise<Job> => {
  const { data } = await api.patch<Job>(API_PATHS.JOB_STATUS(jobId), { status });
  return data;
};

export const useJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJobStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};
