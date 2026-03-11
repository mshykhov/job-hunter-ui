import { useCallback, useState } from "react";

import { createStorage } from "@/lib/storage";

const DEFAULT_ACTIVE_KEYS = ["about", "search", "matching"];
const collapseStorage = createStorage<{ keys: string[] }>("job-prefs-collapse", 1, { keys: DEFAULT_ACTIVE_KEYS });

export const usePersistedKeys = () => {
  const [keys, setKeysRaw] = useState<string[]>(() => collapseStorage.load().keys);

  const setKeys = useCallback((value: string | string[]) => {
    const next = Array.isArray(value) ? value : [value];
    setKeysRaw(next);
    collapseStorage.save({ keys: next });
  }, []);

  return { keys, setKeys };
};
