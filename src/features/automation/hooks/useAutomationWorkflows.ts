import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, API_PATHS } from "@/lib/api";

import type { WorkflowControlAction, WorkflowRun, WorkflowRunSummary } from "../workflowTypes";

const RUNS_KEY = ["automation", "workflows", "runs"] as const;
const runKey = (runId: string) => [...RUNS_KEY, runId] as const;

export const useAutomationRuns = () => {
  const query = useQuery({
    queryKey: RUNS_KEY,
    queryFn: async () => {
      const { data } = await api.get<WorkflowRunSummary[]>(API_PATHS.AUTOMATION_WORKFLOW_RUNS, {
        skipErrorHandler: true,
      });
      return data;
    },
    refetchInterval: 5_000,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    dataUpdatedAt: query.dataUpdatedAt,
    error: query.error,
  };
};

export const useAutomationRun = (runId?: string) => {
  const query = useQuery({
    queryKey: runId ? runKey(runId) : [...RUNS_KEY, "none"],
    queryFn: async () => {
      if (!runId) throw new Error("Workflow run ID is required");
      const { data } = await api.get<WorkflowRun>(API_PATHS.AUTOMATION_WORKFLOW_RUN(runId), {
        skipErrorHandler: true,
      });
      return data;
    },
    enabled: !!runId,
    refetchInterval: 3_000,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    dataUpdatedAt: query.dataUpdatedAt,
    error: query.error,
  };
};

export const useCreateAutomationRun = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (idempotencyKey: string) => {
      const { data } = await api.post<WorkflowRun>(API_PATHS.AUTOMATION_WORKFLOW_RUNS, {
        idempotencyKey,
      });
      return data;
    },
    onSuccess: (run) => {
      queryClient.setQueryData(runKey(run.id), run);
      void queryClient.invalidateQueries({ queryKey: RUNS_KEY });
    },
  });
};

export const useControlAutomationRun = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ runId, action }: { runId: string; action: WorkflowControlAction }) => {
      const { data } = await api.post<WorkflowRun>(
        API_PATHS.AUTOMATION_WORKFLOW_CONTROL(runId, action)
      );
      return data;
    },
    onSuccess: (run) => {
      queryClient.setQueryData(runKey(run.id), run);
      void queryClient.invalidateQueries({ queryKey: RUNS_KEY });
    },
  });
};
