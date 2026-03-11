import { useCallback, useState } from "react";

import { createStorage } from "@/lib/storage";

import type { ExploreFilters } from "../types";

const storage = createStorage<ExploreFilters>("job-hunter-explore-filters", 1, {});

export const useExploreFilters = () => {
  const [filters, setFiltersState] = useState<ExploreFilters>(() => storage.load());

  const setFilters = useCallback((next: ExploreFilters) => {
    storage.save(next);
    setFiltersState(next);
  }, []);

  return { filters, setFilters };
};
