import { useMemo } from "react";

import { useJobSources } from "./useJobSources";

export const useSourceNames = () => {
  const { data: sources = [] } = useJobSources();
  return useMemo(
    () => Object.fromEntries(sources.map((s) => [s.id, s.displayName])),
    [sources],
  );
};
