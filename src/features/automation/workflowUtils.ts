import type { WorkflowStatus } from "./workflowTypes";

export const workflowStatusColor = (status: WorkflowStatus): string => {
  if (status === "SUCCEEDED") return "#166534";
  if (status === "FAILED" || status === "STOPPED") return "#991B1B";
  if (status === "PAUSED") return "#92400E";
  return "#1E40AF";
};
