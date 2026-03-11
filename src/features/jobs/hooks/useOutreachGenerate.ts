import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CoverLetterResponse, RecruiterMessageResponse } from "@/features/settings/types";
import { api, API_PATHS } from "@/lib/api";

import type { JobGroupDetail } from "../types";

export const useGenerateCoverLetter = (jobId: string, groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<CoverLetterResponse>(API_PATHS.JOB_COVER_LETTER(jobId));
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<JobGroupDetail>(["job-detail", groupId], (prev) =>
        prev
          ? {
              ...prev,
              jobs: prev.jobs.map((j) =>
                j.jobId === jobId ? { ...j, coverLetter: data.coverLetter } : j,
              ),
            }
          : undefined,
      );
    },
  });
};

export const useGenerateRecruiterMessage = (jobId: string, groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<RecruiterMessageResponse>(API_PATHS.JOB_RECRUITER_MESSAGE(jobId));
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<JobGroupDetail>(["job-detail", groupId], (prev) =>
        prev
          ? {
              ...prev,
              jobs: prev.jobs.map((j) =>
                j.jobId === jobId ? { ...j, recruiterMessage: data.recruiterMessage } : j,
              ),
            }
          : undefined,
      );
    },
  });
};
