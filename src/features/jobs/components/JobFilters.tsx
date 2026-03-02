import { Flex, Input, InputNumber, Segmented, Select, Switch, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { JOB_SOURCE, USER_JOB_STATUS } from "../types";
import type { JobFilters as JobFiltersType, UserJobStatus } from "../types";
import { STATUS_LABELS } from "../constants";

interface JobFiltersProps {
  filters: JobFiltersType;
  onChange: (filters: JobFiltersType) => void;
  statusCounts: Partial<Record<UserJobStatus, number>>;
}

const sourceOptions = Object.values(JOB_SOURCE).map((s) => ({
  label: s.toUpperCase(),
  value: s,
}));

const STATUS_OPTIONS: { label: string; value: UserJobStatus | "" }[] = [
  { label: "All", value: "" },
  ...Object.values(USER_JOB_STATUS).map((s) => ({
    label: STATUS_LABELS[s],
    value: s,
  })),
];

export const JobFilters = ({ filters, onChange, statusCounts }: JobFiltersProps) => {
  const statusSegments = STATUS_OPTIONS.map(({ label, value }) => {
    const count = value ? (statusCounts[value] ?? 0) : Object.values(statusCounts).reduce((a, b) => a + b, 0);
    return { label: `${label} (${count})`, value };
  });

  return (
    <Flex vertical gap={12}>
      <Segmented
        value={filters.status ?? ""}
        onChange={(val) =>
          onChange({ ...filters, status: (val as UserJobStatus) || undefined })
        }
        options={statusSegments}
        size="middle"
      />
      <Flex gap={12} wrap="wrap" align="center">
        <Select
          placeholder="Source"
          allowClear
          style={{ width: 130 }}
          value={filters.source}
          onChange={(source) => onChange({ ...filters, source })}
          options={sourceOptions}
          size="small"
        />
        <Input
          placeholder="Search title or company..."
          prefix={<SearchOutlined />}
          allowClear
          style={{ width: 220 }}
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
        <Flex align="center" gap={6}>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Min score
          </Typography.Text>
          <InputNumber
            size="small"
            min={0}
            max={100}
            step={5}
            style={{ width: 65 }}
            value={filters.minScore}
            onChange={(v) => onChange({ ...filters, minScore: v ?? undefined })}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
