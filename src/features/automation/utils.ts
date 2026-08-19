import { AUTOMATION_REASONS, type AutomationReason } from "./types";

export const safeReason = (value: AutomationReason): AutomationReason =>
  AUTOMATION_REASONS.includes(value) ? value : "OTHER";

export const formatAutomationTimestamp = (value: string | null): string => {
  if (!value) return "Never";
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toLocaleString() : "Never";
};
