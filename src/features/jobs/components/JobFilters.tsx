import { SearchOutlined } from "@ant-design/icons";
import { DatePicker, Flex, Input, InputNumber, Select, Switch, Typography } from "antd";
import dayjs from "dayjs";

import { STATUS_LABELS, USER_JOB_SORT_LABELS } from "../constants";
import type { JobGroupFilters as JobGroupFiltersType, UserJobSort, UserJobStatus } from "../types";
import { USER_JOB_SORT,USER_JOB_STATUS } from "../types";

interface JobFiltersProps {
  filters: JobGroupFiltersType;
  onChange: (filters: JobGroupFiltersType) => void;
  statusCounts: Partial<Record<UserJobStatus, number>>;
}

const sortOptions = Object.values(USER_JOB_SORT).map((s) => ({
  label: USER_JOB_SORT_LABELS[s],
  value: s,
}));

export const JobFilters = ({ filters, onChange, statusCounts }: JobFiltersProps) => {
  const statusOptions = Object.values(USER_JOB_STATUS).map((s) => ({
    label: `${STATUS_LABELS[s]} (${statusCounts[s] ?? 0})`,
    value: s,
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
          matched after
        </Typography.Text>
        <DatePicker
          showTime
          size="small"
          placeholder="any time"
          allowClear
          format="YYYY-MM-DD HH:mm"
          value={filters.matchedAfter ? dayjs(filters.matchedAfter) : null}
          onChange={(date) => onChange({ ...filters, matchedAfter: date?.toISOString() })}
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
