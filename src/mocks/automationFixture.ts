import { AUTOMATION_COMPONENTS, type AutomationStatus } from "@/features/automation/types";
import type { WorkflowRun } from "@/features/automation/workflowTypes";

const CHECKED_AT = new Date().toISOString();

export const AUTOMATION_STATUS_MOCK: AutomationStatus = {
  enabled: true,
  state: "READY",
  reason: "NONE",
  components: Object.fromEntries(
    AUTOMATION_COMPONENTS.map((component) => [
      component,
      {
        state: "READY",
        reason: "NONE",
        checkedAt: CHECKED_AT,
        probeVersion: "0.1.0",
      },
    ])
  ),
  launcherVersion: "0.1.0",
  lastHeartbeatAt: CHECKED_AT,
  lastPreflightSuccessAt: CHECKED_AT,
  lastCodexSuccessAt: CHECKED_AT,
};

export const AUTOMATION_WORKFLOW_MOCK: WorkflowRun = {
  id: "d07cb2ae-3b18-46d4-8c2d-aeaaf3bbce1f",
  runType: "SYNTHETIC_RECOVERY",
  status: "RUNNING",
  workItemId: "d07cb2ae-3b18-46d4-8c2d-aeaaf3bbce2f",
  workItemStatus: "LEASED",
  completedSteps: 1,
  attemptCount: 1,
  failureCode: null,
  failureDetail: null,
  createdAt: CHECKED_AT,
  updatedAt: CHECKED_AT,
  completedAt: null,
  attempts: [
    {
      id: "d07cb2ae-3b18-46d4-8c2d-aeaaf3bbce3f",
      attemptNumber: 1,
      workerId: "local-runner",
      runnerGeneration: 1,
      startedAt: CHECKED_AT,
      lastHeartbeatAt: CHECKED_AT,
      finishedAt: null,
      outcome: "ACTIVE",
      failureCode: null,
    },
  ],
  checkpoints: [
    {
      id: "d07cb2ae-3b18-46d4-8c2d-aeaaf3bbce4f",
      attemptId: "d07cb2ae-3b18-46d4-8c2d-aeaaf3bbce3f",
      step: "PREPARE",
      stepIndex: 1,
      evidenceSha256: "2f6e7c1d3b0a9fbcad1931090ad05385e8c1d8c7ca6d4b8f1075525852da8a66",
      createdAt: CHECKED_AT,
    },
  ],
  events: [
    {
      id: "d07cb2ae-3b18-46d4-8c2d-aeaaf3bbce5f",
      eventType: "CHECKPOINT_RECORDED",
      payload: { step: "PREPARE", attemptNumber: "1" },
      occurredAt: CHECKED_AT,
    },
  ],
};
