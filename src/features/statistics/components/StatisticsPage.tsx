import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { Alert, Card, Empty, Flex, Segmented, Select, Spin, Typography } from "antd";

import { useJobSources } from "@/features/jobs/hooks/useJobSources";

import {
  STATISTICS_BUCKET_OPTIONS,
  STATISTICS_RANGE,
  STATISTICS_RANGE_OPTIONS,
  type StatisticsRange,
  statisticsRangeStart,
} from "../constants";
import { useVacancyStatistics } from "../hooks/useVacancyStatistics";
import { VACANCY_STATS_BUCKET, type VacancyStatsBucket } from "../types";
import { VacancyStatisticsChart } from "./VacancyStatisticsChart";

const ranges = new Set<string>(Object.values(STATISTICS_RANGE));
const buckets = new Set<string>(Object.values(VACANCY_STATS_BUCKET));

export const StatisticsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const range = (
    ranges.has(searchParams.get("range") ?? "")
      ? searchParams.get("range")
      : STATISTICS_RANGE.DAYS_30
  ) as StatisticsRange;
  const bucket = (
    buckets.has(searchParams.get("bucket") ?? "")
      ? searchParams.get("bucket")
      : VACANCY_STATS_BUCKET.DAY
  ) as VacancyStatsBucket;
  const sourceKey = searchParams.getAll("source").join("\u0000");
  const sources = useMemo(() => (sourceKey ? sourceKey.split("\u0000") : []), [sourceKey]);
  const query = useMemo(
    () => ({ from: statisticsRangeStart(range), bucket, ...(sources.length ? { sources } : {}) }),
    [bucket, range, sources]
  );
  const { data, isLoading, error } = useVacancyStatistics(query);
  const { data: sourceOptions = [] } = useJobSources();

  const updateParams = (next: {
    range?: StatisticsRange;
    bucket?: VacancyStatsBucket;
    sources?: string[];
  }) => {
    const params = new URLSearchParams(searchParams);
    if (next.range) params.set("range", next.range);
    if (next.bucket) params.set("bucket", next.bucket);
    if (next.sources) {
      params.delete("source");
      next.sources.forEach((source) => params.append("source", source));
    }
    setSearchParams(params, { replace: true });
  };

  return (
    <Flex vertical gap={16} className="statistics-page">
      <div>
        <Typography.Title level={4} className="statistics-title">
          Vacancy history
        </Typography.Title>
        <Typography.Text type="secondary">
          Daily flow from every discovered vacancy to matching decisions.
        </Typography.Text>
      </div>
      <Card className="statistics-card">
        <Flex className="statistics-controls" gap={12} wrap>
          <Segmented
            value={range}
            options={STATISTICS_RANGE_OPTIONS}
            onChange={(value) => updateParams({ range: value as StatisticsRange })}
          />
          <Segmented
            value={bucket}
            options={STATISTICS_BUCKET_OPTIONS}
            onChange={(value) => updateParams({ bucket: value as VacancyStatsBucket })}
          />
          <Select
            className="statistics-sources"
            mode="multiple"
            allowClear
            placeholder="All sources"
            value={sources}
            options={sourceOptions.map((source) => ({
              value: source.id,
              label: source.displayName,
            }))}
            onChange={(value) => updateParams({ sources: value })}
          />
        </Flex>
        {data?.exactSince && (
          <Alert
            className="statistics-warning"
            type="info"
            showIcon
            title={`Decision categories are exact from ${formatDate(data.exactSince)}.`}
          />
        )}
        {data?.sourceCoverageSince && (
          <Alert
            className="statistics-warning"
            type="warning"
            showIcon
            title={`Source coverage is complete from ${formatDate(data.sourceCoverageSince)}.`}
          />
        )}
        {isLoading && (
          <Flex className="statistics-loading" justify="center" align="center">
            <Spin size="large" />
          </Flex>
        )}
        {error && (
          <Alert
            type="error"
            showIcon
            title="Vacancy history is unavailable"
            description="The statistics endpoint could not be reached."
          />
        )}
        {data && !data.points.length && (
          <Empty className="statistics-empty" description="No vacancy history for this period" />
        )}
        {data?.points.length ? <VacancyStatisticsChart points={data.points} /> : null}
      </Card>
    </Flex>
  );
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
