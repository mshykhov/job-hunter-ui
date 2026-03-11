import { useCallback,useEffect, useState } from "react";

const FLASH_DURATION = 2500;

export const useSavedFlash = () => {
  const [saved, setSavedRaw] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSavedRaw(false), FLASH_DURATION);
    return () => clearTimeout(t);
  }, [saved]);

  const flash = useCallback(() => setSavedRaw(true), []);

  return { saved, flash };
};
