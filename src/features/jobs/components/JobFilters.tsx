import { SearchOutlined } from "@ant-design/icons";
import { Flex, Input, InputNumber, Segmented, Select, Switch, Typography } from "antd";

import { STATUS_LABELS, USER_JOB_SORT_LABELS } from "@/features/jobs/constants";
import { useJobSources } from "@/features/jobs/hooks/useJobSources";
import { DEFAULT_MATCHED_RANGE, MATCHED_RANGES } from "@/features/jobs/timeRange";
import type { JobGroupFilters, UserJobSort, UserJobStatus } from "@/features/jobs/types";
import { USER_JOB_SORT, USER_JOB_STATUS } from "@/features/jobs/types";

interface JobFiltersProps {
  filters: JobGroupFilters;
  onChange: (filters: JobGroupFilters) => void;
  statusCounts: Partial<Record<UserJobStatus, number>>;
}

const ALL_STATUSES = "all";

const sortOptions = Object.values(USER_JOB_SORT).map((s) => ({
  label: USER_JOB_SORT_LABELS[s],
  value: s,
}));

const rangeOptions = MATCHED_RANGES.map((r) => ({ label: r.label, value: r.value }));

export const JobFilters = ({ filters, onChange, statusCounts }: JobFiltersProps) => {
  const { data: jobSources = [] } = useJobSources();
  const sourceOptions = jobSources.map((s) => ({ label: s.displayName, value: s.id }));

  const activeStatus = filters.statuses?.length === 1 ? filters.statuses[0] : ALL_STATUSES;
  const statusOptions = [
    { label: "All", value: ALL_STATUSES },
    ...Object.values(USER_JOB_STATUS).map((s) => ({
      label: `${STATUS_LABELS[s]} ${statusCounts[s] ?? 0}`,
      value: s,
    })),
  ];

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
            value={filters.sortBy ?? USER_JOB_SORT.SCORE}
            options={sortOptions}
            onChange={(val) => onChange({ ...filters, sortBy: val as UserJobSort })}
          />
        </Flex>
      </Flex>

      <Flex align="center" gap={16} wrap="wrap">
        <Segmented
          value={activeStatus}
          options={statusOptions}
          onChange={(val) =>
            onChange({ ...filters, statuses: val === ALL_STATUSES ? undefined : [val as UserJobStatus] })
          }
        />
        <Select
          mode="multiple"
          placeholder="Sources"
          allowClear
          variant="filled"
          className="jobs-filters-sources"
          value={filters.sources ?? []}
          onChange={(sources: string[]) =>
            onChange({ ...filters, sources: sources.length ? sources : undefined })
          }
          options={sourceOptions}
          maxTagCount="responsive"
        />
        <Select
          variant="filled"
          className="jobs-filters-range"
          value={filters.matchedWithin ?? DEFAULT_MATCHED_RANGE}
          options={rangeOptions}
          onChange={(val) => onChange({ ...filters, matchedWithin: val, matchedAfter: undefined })}
        />
        <Flex align="center" gap={6}>
          <Typography.Text type="secondary" className="jobs-filters-label">
            min score
          </Typography.Text>
          <InputNumber
            variant="filled"
            min={0}
            max={100}
            placeholder="0"
            value={filters.minScore}
            onChange={(val) => onChange({ ...filters, minScore: val ?? undefined })}
            className="jobs-filters-score"
          />
        </Flex>
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
