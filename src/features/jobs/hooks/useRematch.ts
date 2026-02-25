import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, API_PATHS } from "@/lib/api";

interface RematchResponse {
  jobsQueued: number;
}

const rematch = async (since?: string): Promise<RematchResponse> => {
  const params: Record<string, string> = {};
  if (since) params.since = since;
  const { data } = await api.post<RematchResponse>(API_PATHS.JOBS_REMATCH, null, { params });
  return data;
};

export const useRematch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rematch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};
