import type { JobSource, PublicJobSort } from "@/features/jobs/types";

export interface ExploreFilters {
  sources?: JobSource[];
  search?: string;
  remote?: boolean;
  since?: string;
  sortBy?: PublicJobSort;
  size?: number;
}
