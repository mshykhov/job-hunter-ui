import { lazy, Suspense, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { Alert, Card, Empty, Flex, Spin, Typography } from "antd";

import { useJobSources } from "@/features/jobs/hooks/useJobSources";

import { STATISTICS_RANGE, type StatisticsRange } from "../constants";
import { useVacancyStatistics } from "../hooks/useVacancyStatistics";
import { ALL_TIME_START, statisticsRangeBucket, statisticsRangeStart } from "../range";
import { VACANCY_STATS_BUCKET, type VacancyStatsBucket } from "../types";
import { StatisticsControls } from "./StatisticsControls";

const VacancyStatisticsChart = lazy(() => import("./VacancyStatisticsChart"));

const ranges = new Set<string>(Object.values(STATISTICS_RANGE));
const buckets = new Set<string>(Object.values(VACANCY_STATS_BUCKET));

export const StatisticsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const range = (
    ranges.has(searchParams.get("range") ?? "")
      ? searchParams.get("range")
      : STATISTICS_RANGE.DAYS_30
  ) as StatisticsRange;
  const bucketParam = searchParams.get("bucket");
  const bucket = (
    buckets.has(bucketParam ?? "") ? bucketParam : statisticsRangeBucket(range)
  ) as VacancyStatsBucket;
  const customFrom = validIso(searchParams.get("from"));
  const customTo = validIso(searchParams.get("to"));
  const sourceKey = searchParams.getAll("source").join("\u0000");
  const sources = useMemo(() => (sourceKey ? sourceKey.split("\u0000") : []), [sourceKey]);
  const query = useMemo(() => {
    const from =
      range === STATISTICS_RANGE.ALL
        ? ALL_TIME_START
        : range === STATISTICS_RANGE.CUSTOM
          ? customFrom
          : statisticsRangeStart(range);
    return {
      ...(from ? { from } : {}),
      ...(range === STATISTICS_RANGE.CUSTOM && customTo ? { to: customTo } : {}),
      bucket,
      ...(sources.length ? { sources } : {}),
    };
  }, [bucket, customFrom, customTo, range, sources]);
  const { data, isLoading, error } = useVacancyStatistics(query);
  const { data: sourceOptions = [] } = useJobSources();

  const updateParams = (next: {
    range?: StatisticsRange;
    bucket?: VacancyStatsBucket;
    sources?: string[];
  }) => {
    const params = new URLSearchParams(searchParams);
    if (next.range) params.set("range", next.range);
    if (next.range) params.delete("bucket");
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
        <StatisticsControls
          range={range}
          bucket={bucket}
          sources={sources}
          sourceOptions={sourceOptions}
          customFrom={customFrom}
          customTo={customTo}
          onRange={(value) => updateParams({ range: value })}
          onBucket={(value) => updateParams({ bucket: value })}
          onSources={(value) => updateParams({ sources: value })}
          onCustomRange={(from, to) => {
            const params = new URLSearchParams(searchParams);
            params.set("range", STATISTICS_RANGE.CUSTOM);
            params.set("from", from);
            params.set("to", to);
            params.delete("bucket");
            setSearchParams(params, { replace: true });
          }}
        />
        {data?.exactSince && queryIntersectsBefore(query.from, data.exactSince) && (
          <Alert
            className="statistics-warning"
            type="info"
            showIcon
            title={`Decision categories are exact from ${formatDate(data.exactSince)}.`}
          />
        )}
        {data?.sourceCoverageSince &&
          sources.length > 0 &&
          queryIntersectsBefore(query.from, data.sourceCoverageSince) && (
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
        {data?.points.length ? (
          <Suspense
            fallback={
              <Flex className="statistics-loading" justify="center" align="center">
                <Spin size="large" />
              </Flex>
            }
          >
            <VacancyStatisticsChart
              points={data.points}
              exactSince={data.exactSince}
              bucket={data.bucket}
            />
          </Suspense>
        ) : null}
      </Card>
    </Flex>
  );
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));

const validIso = (value: string | null): string | undefined =>
  value && !Number.isNaN(Date.parse(value)) ? value : undefined;
const queryIntersectsBefore = (from: string | undefined, coverageSince: string) =>
  !from || from < coverageSince;
