import { Flex, Input, Select, Switch, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { JobFilters, JobSource } from "@/features/jobs/types";
import { useJobSources } from "@/features/jobs/hooks/useJobSources";

interface ExploreFiltersProps {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
}

export const ExploreFilters = ({ filters, onChange }: ExploreFiltersProps) => {
  const { data: sources = [] } = useJobSources();

  const sourceOptions = sources.map((s) => ({
    label: s,
    value: s,
  }));
  return (
    <Flex gap={12} wrap="wrap" align="center">
      <Select
        mode="multiple"
        placeholder="Source"
        allowClear
        style={{ minWidth: 130 }}
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
