import { MATERIAL_STATUS, type MaterialStatus } from "./types";

export const MATERIAL_STATUS_LABELS: Record<MaterialStatus, string> = {
  QUEUED: "Queued",
  CLAIMED: "Claimed",
  GENERATING: "Writing",
  VALIDATING: "Validating",
  RENDERING: "Rendering CV",
  READY: "Ready",
  READY_WITH_FALLBACK: "Ready with fallback",
  BLOCKED: "Needs attention",
  FAILED: "Failed",
};

export const ACTIVE_MATERIAL_STATUSES = new Set<MaterialStatus>([
  MATERIAL_STATUS.QUEUED,
  MATERIAL_STATUS.CLAIMED,
  MATERIAL_STATUS.GENERATING,
  MATERIAL_STATUS.VALIDATING,
  MATERIAL_STATUS.RENDERING,
]);
