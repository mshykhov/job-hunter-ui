import { createStorage } from "@/lib/storage";

/**
 * Rebindable shortcut actions. Bindings store `KeyboardEvent.code` values
 * (physical key position) so they work on any keyboard layout; labels always
 * render the QWERTY character. Navigation keys (arrows, Enter, Esc) are fixed.
 */
export const SHORTCUT_ACTIONS = {
  markApplied: { label: "Mark Applied", defaultCodes: ["KeyA"] },
  markIrrelevant: { label: "Mark Irrelevant", defaultCodes: ["KeyD", "KeyX"] },
  resetStatus: { label: "Reset to New", defaultCodes: ["KeyR"] },
  openOriginal: { label: "Open original posting", defaultCodes: ["KeyO"] },
  prevJob: { label: "Previous job (review)", defaultCodes: ["KeyQ"] },
  nextJob: { label: "Next job (review)", defaultCodes: ["KeyE"] },
} as const;

export type ShortcutActionId = keyof typeof SHORTCUT_ACTIONS;

type Overrides = Partial<Record<ShortcutActionId, string[]>>;

const storage = createStorage<Overrides>("jobhunter.shortcuts", 1, {});

let overrides: Overrides = storage.load();
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((fn) => fn());

export const subscribeKeybindings = (fn: () => void): (() => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const getBindings = (): Record<ShortcutActionId, string[]> => {
  const ids = Object.keys(SHORTCUT_ACTIONS) as ShortcutActionId[];
  return Object.fromEntries(
    ids.map((id) => [id, overrides[id] ?? SHORTCUT_ACTIONS[id].defaultCodes])
  ) as Record<ShortcutActionId, string[]>;
};

export const setBinding = (id: ShortcutActionId, code: string): void => {
  overrides = { ...overrides, [id]: [code] };
  storage.save(overrides);
  notify();
};

export const resetBindings = (): void => {
  overrides = {};
  storage.clear();
  notify();
};

export const isCustomized = (): boolean => Object.keys(overrides).length > 0;

/** Returns the action bound to a physical key, or null. */
export const matchShortcut = (code: string): ShortcutActionId | null => {
  const bindings = getBindings();
  const ids = Object.keys(bindings) as ShortcutActionId[];
  return ids.find((id) => bindings[id].includes(code)) ?? null;
};

/** Human-readable key label for a `KeyboardEvent.code` (QWERTY). */
export const codeToLabel = (code: string): string => {
  if (code.startsWith("Key")) return code.slice(3);
  if (code.startsWith("Digit")) return code.slice(5);
  return code;
};
