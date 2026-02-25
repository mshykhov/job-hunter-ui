import { useState, useCallback, useEffect } from "react";
import { createStorage } from "@/lib/storage";

type ThemeMode = "dark" | "light";

interface ThemeState {
  mode: ThemeMode;
}

const storage = createStorage<ThemeState>("job-hunter-theme", 1, { mode: "dark" });

export const useTheme = () => {
  const [{ mode }, setState] = useState<ThemeState>(storage.load);

  useEffect(() => {
    storage.save({ mode });
  }, [mode]);

  const toggle = useCallback(() => {
    setState((prev) => ({ mode: prev.mode === "dark" ? "light" : "dark" }));
  }, []);

  return { mode, toggle, isDark: mode === "dark" };
};
