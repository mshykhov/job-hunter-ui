export const WORKFLOW_STATUSES = [
  "QUEUED",
  "RUNNING",
  "PAUSED",
  "STOPPED",
  "SUCCEEDED",
  "FAILED",
] as const;
export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];

export type WorkItemStatus = "QUEUED" | "LEASED" | "SUCCEEDED" | "CANCELLED" | "FAILED";
export type AttemptOutcome =
  | "ACTIVE"
  | "SUCCEEDED"
  | "PAUSED"
  | "STOPPED"
  | "STALE_GENERATION"
  | "LEASE_EXPIRED"
  | "FAILED";
export type WorkflowStep = "PREPARE" | "EXECUTE" | "VERIFY";

export interface WorkflowRunSummary {
  id: string;
  runType: "SYNTHETIC_RECOVERY";
  status: WorkflowStatus;
  completedSteps: number;
  attemptCount: number;
  failureCode: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  completedAt: string | null;
}

export interface WorkflowAttempt {
  id: string;
  attemptNumber: number;
  workerId: string;
  runnerGeneration: number;
  startedAt: string;
  lastHeartbeatAt: string;
  finishedAt: string | null;
  outcome: AttemptOutcome;
  failureCode: string | null;
}

export interface WorkflowCheckpoint {
  id: string;
  attemptId: string;
  step: WorkflowStep;
  stepIndex: number;
  evidenceSha256: string;
  createdAt: string | null;
}

export interface WorkflowEvent {
  id: string;
  eventType: string;
  payload: Record<string, string>;
  occurredAt: string;
}

export interface WorkflowRun extends WorkflowRunSummary {
  workItemId: string;
  workItemStatus: WorkItemStatus;
  failureDetail: string | null;
  attempts: WorkflowAttempt[];
  checkpoints: WorkflowCheckpoint[];
  events: WorkflowEvent[];
}

export type WorkflowControlAction = "pause" | "resume" | "stop";
