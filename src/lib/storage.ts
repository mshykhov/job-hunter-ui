interface StorageEntry<T> {
  v: number;
  data: T;
}

export const createStorage = <T>(key: string, version: number, defaults: T) => ({
  load: (): T => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return defaults;
      const entry: StorageEntry<T> = JSON.parse(raw);
      if (entry.v !== version) {
        localStorage.removeItem(key);
        return defaults;
      }
      return { ...defaults, ...entry.data };
    } catch {
      localStorage.removeItem(key);
      return defaults;
    }
  },

  save: (data: T): void => {
    try {
      const entry: StorageEntry<T> = { v: version, data };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch {
      // quota exceeded — silently ignore
    }
  },

  clear: (): void => {
    localStorage.removeItem(key);
  },
});
