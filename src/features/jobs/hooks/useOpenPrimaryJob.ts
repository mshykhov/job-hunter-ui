import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import type { JobGroup, JobGroupDetail } from "@/features/jobs/types";
import { sortJobsByDate } from "@/features/jobs/utils/jobDetailUtils";
import { api, API_PATHS } from "@/lib/api";

const pickPrimaryUrl = (detail: JobGroupDetail, primarySource: string | undefined): string | null => {
  if (!detail.jobs.length) return null;
  const bySource = detail.jobs.find((j) => j.source === primarySource);
  return (bySource ?? sortJobsByDate(detail.jobs)[0]).url;
};

export const useOpenPrimaryJob = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (job: JobGroup) => {
      // Open the tab synchronously inside the click gesture so the popup blocker allows it.
      const tab = window.open("about:blank", "_blank");
      try {
        const detail = await queryClient.fetchQuery({
          queryKey: ["job-detail", job.groupId],
          queryFn: async () => {
            const { data } = await api.get<JobGroupDetail>(API_PATHS.JOB_GROUP_DETAIL(job.groupId));
            return data;
          },
          staleTime: 60_000,
        });
        const url = pickPrimaryUrl(detail, job.sources[0]);
        if (tab && url) {
          tab.opener = null;
          tab.location.href = url;
        } else {
          tab?.close();
        }
      } catch {
        tab?.close();
      }
    },
    [queryClient],
  );
};
