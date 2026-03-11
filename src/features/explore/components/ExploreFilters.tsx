import { SearchOutlined } from "@ant-design/icons";
import { DatePicker, Flex, Input, Select, Switch, Typography } from "antd";
import dayjs from "dayjs";

import { PUBLIC_JOB_SORT_LABELS } from "@/features/jobs/constants";
import { useJobSources } from "@/features/jobs/hooks/useJobSources";
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

export const ExploreFilters = ({ filters, onChange }: ExploreFiltersProps) => {
  const { data: sources = [] } = useJobSources();

  const sourceOptions = sources.map((s) => ({
    label: s.displayName,
    value: s.id,
  }));

  return (
    <Flex gap={12} wrap="wrap" align="center">
      <Flex align="center" gap={4}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          sort
        </Typography.Text>
        <Select
          value={filters.sortBy ?? PUBLIC_JOB_SORT.PUBLISHED}
          onChange={(val) => onChange({ ...filters, sortBy: val as PublicJobSort })}
          options={sortOptions}
          size="small"
          variant="borderless"
          style={{ width: 110 }}
        />
      </Flex>
      <Flex align="center" gap={4}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          from
        </Typography.Text>
        <DatePicker
          showTime
          size="small"
          placeholder="any time"
          allowClear
          format="YYYY-MM-DD HH:mm"
          value={filters.since ? dayjs(filters.since) : null}
          onChange={(date) => onChange({ ...filters, since: date?.toISOString() })}
          presets={[
            { label: "12h", value: dayjs().subtract(12, "hour") },
            { label: "24h", value: dayjs().subtract(24, "hour") },
            { label: "3 days", value: dayjs().subtract(3, "day") },
            { label: "7 days", value: dayjs().subtract(7, "day") },
          ]}
          style={{ width: 190 }}
        />
      </Flex>
      <Select
        mode="multiple"
        placeholder="Source"
        allowClear
        style={{ minWidth: 170 }}
        value={filters.sources ?? []}
        onChange={(sources: JobSource[]) =>
          onChange({ ...filters, sources: sources.length ? sources : undefined })
        }
        options={sourceOptions}
        size="small"
        maxTagCount="responsive"
      />
      <Input
        placeholder="Search title, company, location..."
        prefix={<SearchOutlined />}
        allowClear
        style={{ width: 250 }}
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
        size="small"
      />
      <Flex align="center" gap={6}>
        <Switch
          size="small"
          checked={filters.remote}
          onChange={(remote) => onChange({ ...filters, remote: remote || undefined })}
        />
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Remote
        </Typography.Text>
      </Flex>
    </Flex>
  );
};
