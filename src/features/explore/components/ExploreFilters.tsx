import { SearchOutlined } from "@ant-design/icons";
import { Flex, Input, Segmented, Select, Switch, Typography } from "antd";

import { PUBLIC_JOB_SORT_LABELS } from "@/features/jobs/constants";
import { useJobSources } from "@/features/jobs/hooks/useJobSources";
import { MATCHED_RANGES } from "@/features/jobs/timeRange";
import type { JobSource, PublicJobSort } from "@/features/jobs/types";
import { PUBLIC_JOB_SORT } from "@/features/jobs/types";

import type { ExploreFilters as ExploreFiltersType } from "../types";

interface ExploreFiltersProps {
  filters: ExploreFiltersType;
  onChange: (filters: ExploreFiltersType) => void;
}

const sortOptions = Object.values(PUBLIC_JOB_SORT).map((s) => ({
  label: PUBLIC_JOB_SORT_LABELS[s],
  value: s,
}));

const rangeOptions = MATCHED_RANGES.map((r) => ({ label: r.label, value: r.value }));

export const ExploreFilters = ({ filters, onChange }: ExploreFiltersProps) => {
  const { data: sources = [] } = useJobSources();
  const sourceOptions = sources.map((s) => ({ label: s.displayName, value: s.id }));

  return (
    <Flex vertical gap={12} className="jobs-filters">
      <Flex align="center" gap={12} wrap="wrap">
        <Input
          placeholder="Search title, company, location..."
          prefix={<SearchOutlined />}
          allowClear
          className="jobs-filters-search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
        />
        <Flex align="center" gap={8}>
          <Typography.Text type="secondary" className="jobs-filters-label">
            Sort
          </Typography.Text>
          <Segmented
            value={filters.sortBy ?? PUBLIC_JOB_SORT.PUBLISHED}
            options={sortOptions}
            onChange={(val) => onChange({ ...filters, sortBy: val as PublicJobSort })}
          />
        </Flex>
      </Flex>

      <Flex align="center" gap={16} wrap="wrap">
        <Select
          mode="multiple"
          placeholder="Sources"
          allowClear
          variant="filled"
          className="jobs-filters-sources"
          value={filters.sources ?? []}
          onChange={(next: JobSource[]) =>
            onChange({ ...filters, sources: next.length ? next : undefined })
          }
          options={sourceOptions}
          maxTagCount="responsive"
        />
        <Select
          variant="filled"
          className="jobs-filters-range"
          value={filters.within ?? "all"}
          options={rangeOptions}
          onChange={(val) => onChange({ ...filters, within: val, since: undefined })}
        />
        <Flex align="center" gap={6}>
          <Switch
            size="small"
            checked={filters.remote}
            onChange={(remote) => onChange({ ...filters, remote: remote || undefined })}
          />
          <Typography.Text type="secondary" className="jobs-filters-label">
            Remote
          </Typography.Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
