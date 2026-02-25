import { Flex, Select, Input, Switch, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { JOB_SOURCE } from "../types";
import { STATUS_LABELS } from "../constants";
import type { JobFilters as JobFiltersType } from "../types";

interface JobFiltersProps {
  filters: JobFiltersType;
  onChange: (filters: JobFiltersType) => void;
}

const sourceOptions = Object.values(JOB_SOURCE).map((s) => ({
  label: s.toUpperCase(),
  value: s,
}));

const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  label,
  value,
}));

export const JobFilters = ({ filters, onChange }: JobFiltersProps) => {
  return (
    <Flex gap={12} wrap="wrap" align="center">
      <Select
        placeholder="Source"
        allowClear
        style={{ width: 140 }}
        value={filters.source}
        onChange={(source) => onChange({ ...filters, source })}
        options={sourceOptions}
      />
      <Select
        placeholder="Status"
        allowClear
        style={{ width: 140 }}
        value={filters.status}
        onChange={(status) => onChange({ ...filters, status })}
        options={statusOptions}
      />
      <Flex align="center" gap={6}>
        <Switch
          size="small"
          checked={filters.remote}
          onChange={(remote) => onChange({ ...filters, remote: remote || undefined })}
        />
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          Remote
        </Typography.Text>
      </Flex>
      <Input
        placeholder="Search title or company..."
        prefix={<SearchOutlined />}
        allowClear
        style={{ width: 240 }}
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
      />
    </Flex>
  );
};
