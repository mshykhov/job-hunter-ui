import type { UserJobStatus } from "./types";
import { USER_JOB_STATUS } from "./types";

/**
 * Shortcuts key off `KeyboardEvent.code` (physical key position) rather than
 * `.key` (the produced character), so they fire on any keyboard layout - the
 * physical "A" works under Cyrillic, AZERTY, etc. Hints are always shown as the
 * QWERTY letter.
 */
export const isTypingTarget = (target: EventTarget | null): boolean => {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable;
};

export const hasModifier = (e: KeyboardEvent): boolean =>
  e.ctrlKey || e.metaKey || e.altKey;

export const STATUS_KEYS: Record<string, UserJobStatus> = {
  KeyA: USER_JOB_STATUS.APPLIED,
  KeyD: USER_JOB_STATUS.IRRELEVANT,
  KeyX: USER_JOB_STATUS.IRRELEVANT,
  KeyR: USER_JOB_STATUS.NEW,
};
