import type { WorkflowStatus } from "./workflowTypes";

export const workflowStatusColor = (status: WorkflowStatus): string => {
  if (status === "SUCCEEDED") return "success";
  if (status === "FAILED" || status === "STOPPED") return "error";
  if (status === "PAUSED") return "warning";
  return "processing";
};
