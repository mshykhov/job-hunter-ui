import { DatePicker, Flex, Segmented, Select } from "antd";
import dayjs from "dayjs";

import type { JobSourceOption } from "@/features/jobs/hooks/useJobSources";

import {
  STATISTICS_BUCKET_OPTIONS,
  STATISTICS_RANGE_OPTIONS,
  type StatisticsRange,
} from "../constants";
import type { VacancyStatsBucket } from "../types";

interface StatisticsControlsProps {
  range: StatisticsRange;
  bucket: VacancyStatsBucket;
  sources: string[];
  sourceOptions: JobSourceOption[];
  customFrom?: string;
  customTo?: string;
  onRange: (value: StatisticsRange) => void;
  onBucket: (value: VacancyStatsBucket) => void;
  onSources: (value: string[]) => void;
  onCustomRange: (from: string, to: string) => void;
}

export const StatisticsControls = ({
  range,
  bucket,
  sources,
  sourceOptions,
  customFrom,
  customTo,
  onRange,
  onBucket,
  onSources,
  onCustomRange,
}: StatisticsControlsProps) => (
  <Flex className="statistics-controls" gap={12} wrap>
    <Segmented
      value={range}
      options={STATISTICS_RANGE_OPTIONS}
      onChange={(value) => onRange(value as StatisticsRange)}
    />
    <DatePicker.RangePicker
      value={
        range === "custom" && customFrom && customTo ? [dayjs(customFrom), dayjs(customTo)] : null
      }
      onChange={(dates) => {
        if (dates?.[0] && dates[1])
          onCustomRange(dates[0].startOf("day").toISOString(), dates[1].endOf("day").toISOString());
      }}
    />
    <Segmented
      value={bucket}
      options={STATISTICS_BUCKET_OPTIONS}
      onChange={(value) => onBucket(value as VacancyStatsBucket)}
    />
    <Select
      className="statistics-sources"
      mode="multiple"
      allowClear
      placeholder="All sources"
      value={sources}
      options={sourceOptions.map((source) => ({ value: source.id, label: source.displayName }))}
      onChange={onSources}
    />
  </Flex>
);
