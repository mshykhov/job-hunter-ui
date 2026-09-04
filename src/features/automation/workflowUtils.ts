import type { WorkflowStatus, WorkflowStep } from "./workflowTypes";

export const workflowStatusColor = (status: WorkflowStatus): string => {
  if (status === "SUCCEEDED") return "success";
  if (status === "FAILED" || status === "STOPPED") return "error";
  if (status === "PAUSED") return "warning";
  return "cyan";
};

export const isActionableWorkflow = (status: WorkflowStatus): boolean =>
  status === "QUEUED" || status === "RUNNING" || status === "PAUSED";

export const workflowStatusLabel = (status: WorkflowStatus): string =>
  ({
    QUEUED: "Queued",
    RUNNING: "Running",
    PAUSED: "Paused",
    STOPPED: "Stopped",
    SUCCEEDED: "Succeeded",
    FAILED: "Failed",
  })[status];

export const workflowStepLabel = (step: WorkflowStep): string =>
  ({ PREPARE: "Prepare", EXECUTE: "Execute", VERIFY: "Verify" })[step];
