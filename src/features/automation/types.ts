export const AUTOMATION_STATES = ["READY", "DEGRADED", "AUTH_REQUIRED", "UNAVAILABLE"] as const;
export type AutomationState = (typeof AUTOMATION_STATES)[number];

export const AUTOMATION_COMPONENTS = [
  "LAUNCHER",
  "API",
  "DATABASE",
  "CHROME",
  "PLAYWRIGHT",
  "BROWSER_MCP",
  "JOB_HUNTER_MCP",
  "CODEX",
] as const;
export type AutomationComponent = (typeof AUTOMATION_COMPONENTS)[number];

export const AUTOMATION_REASONS = [
  "NONE",
  "API_UNAVAILABLE",
  "DATABASE_UNAVAILABLE",
  "CHROME_UNAVAILABLE",
  "PROFILE_UNREADABLE",
  "PLAYWRIGHT_UNAVAILABLE",
  "MCP_UNAVAILABLE",
  "CODEX_AUTH_REQUIRED",
  "SITE_AUTH_REQUIRED",
  "CANARY_FAILED",
  "CLOCK_SKEW",
  "STALE_GENERATION",
  "INVALID_REPORT",
  "OTHER",
] as const;
export type AutomationReason = (typeof AUTOMATION_REASONS)[number];

export interface AutomationComponentSnapshot {
  state: AutomationState;
  reason: AutomationReason;
  checkedAt: string;
  probeVersion: string;
}

export interface AutomationStatus {
  enabled: boolean;
  state: AutomationState;
  reason: AutomationReason;
  components: Partial<Record<AutomationComponent, AutomationComponentSnapshot>>;
  launcherVersion: string | null;
  lastHeartbeatAt: string | null;
  lastPreflightSuccessAt: string | null;
  lastCodexSuccessAt: string | null;
}
