import { useCallback, useState } from "react";
import type { JobFilters } from "@/features/jobs/types";
import { createStorage } from "@/lib/storage";

const storage = createStorage<JobFilters>("job-hunter-explore-filters", 1, {});

export const useExploreFilters = () => {
  const [filters, setFiltersState] = useState<JobFilters>(() => storage.load());

  const setFilters = useCallback((next: JobFilters) => {
    storage.save(next);
    setFiltersState(next);
  }, []);

  return { filters, setFilters };
};
