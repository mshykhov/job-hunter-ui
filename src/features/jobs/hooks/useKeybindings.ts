import { useSyncExternalStore } from "react";

import type { ShortcutActionId } from "../keybindings";
import { codeToLabel, getBindings, subscribeKeybindings } from "../keybindings";

let cache = getBindings();

const getSnapshot = () => cache;

const subscribe = (fn: () => void) =>
  subscribeKeybindings(() => {
    cache = getBindings();
    fn();
  });

/** Reactive view of the current key bindings, for hints and the editor. */
export const useKeybindings = () => {
  const bindings = useSyncExternalStore(subscribe, getSnapshot);

  const keyLabel = (id: ShortcutActionId): string => bindings[id].map(codeToLabel).join(" / ");

  return { bindings, keyLabel };
};
