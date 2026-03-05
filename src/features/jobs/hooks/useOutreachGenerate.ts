import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, API_PATHS } from "@/lib/api";
import type { CoverLetterResponse, RecruiterMessageResponse } from "@/features/settings/types";
import type { JobDetail } from "../types";

export const useGenerateCoverLetter = (jobId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<CoverLetterResponse>(API_PATHS.JOB_COVER_LETTER(jobId));
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<JobDetail>(["job-detail", jobId], (prev) =>
        prev ? { ...prev, coverLetter: data.coverLetter } : undefined,
      );
    },
  });
};

export const useGenerateRecruiterMessage = (jobId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<RecruiterMessageResponse>(API_PATHS.JOB_RECRUITER_MESSAGE(jobId));
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<JobDetail>(["job-detail", jobId], (prev) =>
        prev ? { ...prev, recruiterMessage: data.recruiterMessage } : undefined,
      );
    },
  });
};
