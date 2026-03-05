import { DatePicker, Flex, Input, InputNumber, Select, Switch, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { USER_JOB_STATUS, USER_JOB_SORT, PERIOD_FIELD } from "../types";
import type { JobFilters as JobFiltersType, JobSource, PeriodField, UserJobSort, UserJobStatus } from "../types";
import { STATUS_LABELS, PERIOD_FIELD_LABELS, USER_JOB_SORT_LABELS } from "../constants";
import { useJobSources } from "../hooks/useJobSources";

interface JobFiltersProps {
  filters: JobFiltersType;
  onChange: (filters: JobFiltersType) => void;
  statusCounts: Partial<Record<UserJobStatus, number>>;
}

const periodFieldOptions = Object.values(PERIOD_FIELD).map((f) => ({
  label: PERIOD_FIELD_LABELS[f],
  value: f,
}));

const sortOptions = Object.values(USER_JOB_SORT).map((s) => ({
  label: USER_JOB_SORT_LABELS[s],
  value: s,
}));

export const JobFilters = ({ filters, onChange, statusCounts }: JobFiltersProps) => {
  const { data: sources = [] } = useJobSources();

  const statusOptions = Object.values(USER_JOB_STATUS).map((s) => ({
    label: `${STATUS_LABELS[s]} (${statusCounts[s] ?? 0})`,
    value: s,
  }));

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
          value={filters.sortBy ?? USER_JOB_SORT.SCORE}
          onChange={(val) => onChange({ ...filters, sortBy: val as UserJobSort })}
          options={sortOptions}
          size="small"
          variant="borderless"
          style={{ width: 100 }}
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
      <Flex align="center" gap={4}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          by
        </Typography.Text>
        <Select
          value={filters.periodField ?? PERIOD_FIELD.MATCHED}
          onChange={(val) => onChange({ ...filters, periodField: val as PeriodField })}
          options={periodFieldOptions}
          size="small"
          variant="borderless"
          style={{ width: 105 }}
        />
      </Flex>
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
        style={{ minWidth: 170 }}
        value={filters.sources ?? []}
        onChange={(sources: JobSource[]) =>
          onChange({ ...filters, sources: sources.length ? sources : undefined })
        }
        options={sourceOptions}
        size="small"
        maxTagCount="responsive"
      />
      <Flex align="center" gap={4}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          score
        </Typography.Text>
        <InputNumber
          size="small"
          min={0}
          max={100}
          placeholder="min"
          value={filters.minScore}
          onChange={(val) => onChange({ ...filters, minScore: val ?? undefined })}
          style={{ width: 65 }}
        />
      </Flex>
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
