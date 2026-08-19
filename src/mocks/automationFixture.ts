import { AUTOMATION_COMPONENTS, type AutomationStatus } from "@/features/automation/types";

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
