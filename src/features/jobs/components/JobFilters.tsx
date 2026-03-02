import { Flex, Input, InputNumber, Segmented, Select, Switch, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { JOB_SOURCE, USER_JOB_STATUS, PERIOD_FIELD } from "../types";
import type { JobFilters as JobFiltersType, JobSource, PeriodField, UserJobStatus } from "../types";
import { STATUS_LABELS, PERIOD_OPTIONS, PERIOD_FIELD_LABELS } from "../constants";

interface JobFiltersProps {
  filters: JobFiltersType;
  onChange: (filters: JobFiltersType) => void;
  statusCounts: Partial<Record<UserJobStatus, number>>;
}

const periodFieldOptions = Object.values(PERIOD_FIELD).map((f) => ({
  label: PERIOD_FIELD_LABELS[f],
  value: f,
}));

export const JobFilters = ({ filters, onChange, statusCounts }: JobFiltersProps) => {
  const statusOptions = Object.values(USER_JOB_STATUS).map((s) => ({
    label: `${STATUS_LABELS[s]} (${statusCounts[s] ?? 0})`,
    value: s,
  }));

  const sourceOptions = Object.values(JOB_SOURCE).map((s) => ({
    label: s.toUpperCase(),
    value: s,
  }));

  return (
    <Flex gap={12} wrap="wrap" align="center">
      <Segmented
        value={filters.period ?? "24h"}
        onChange={(val) => onChange({ ...filters, period: val as string })}
        options={PERIOD_OPTIONS}
        size="small"
      />
      <Select
        value={filters.periodField ?? PERIOD_FIELD.MATCHED}
        onChange={(val) => onChange({ ...filters, periodField: val as PeriodField })}
        options={periodFieldOptions}
        size="small"
        style={{ width: 110 }}
      />
      <Select
        mode="multiple"
        placeholder="Status"
        allowClear
        style={{ minWidth: 130 }}
        value={filters.statuses ?? []}
        onChange={(statuses: UserJobStatus[]) =>
          onChange({ ...filters, statuses: statuses.length ? statuses : undefined })
        }
        options={statusOptions}
        size="small"
        maxTagCount="responsive"
      />
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
  );
};
