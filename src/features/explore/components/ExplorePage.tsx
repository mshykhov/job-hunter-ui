import { useMemo } from "react";

import { ReloadOutlined } from "@ant-design/icons";
import { Button, Flex, Tooltip, Typography } from "antd";

import { JobTable } from "@/features/jobs/components/JobTable";
import { TableSettings } from "@/features/jobs/components/TableSettings";
import { mapPublicJobToTableRow,usePublicJobs } from "@/features/jobs/hooks/usePublicJobs";
import { type ColumnKey,useTableSettings } from "@/features/jobs/hooks/useTableSettings";
import type { JobGroup } from "@/features/jobs/types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import { useExploreFilters } from "../hooks/useExploreFilters";
import { ExploreFilters } from "./ExploreFilters";

const EXPLORE_COLUMNS: Set<ColumnKey> = new Set([
  "rowNum", "title", "company", "sources", "salary", "locations", "publishedAt", "updatedAt",
]);

export const ExplorePage = () => {
  const { filters, setFilters } = useExploreFilters();

  const { settings, toggleColumn, setColumnWidth, setDensity, reorderColumns } =
    useTableSettings("job-hunter-explore-table");

  const debouncedFilters = useDebouncedValue(filters, 300);

  const {
    jobs: publicJobs,
    totalElements,
    isLoading,
    isFetching,
    isPlaceholderData,
    refetch,
    dataUpdatedAt,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePublicJobs(debouncedFilters);

  const jobs = useMemo(() => publicJobs.map(mapPublicJobToTableRow), [publicJobs]);

  const descriptionMap = useMemo(
    () => new Map(publicJobs.map((j) => [j.id, j.description])),
    [publicJobs],
  );

  const expandable = useMemo(
    () => ({
      expandedRowRender: (record: JobGroup) => (
        <Typography.Paragraph
          style={{ margin: 0, whiteSpace: "pre-wrap", maxHeight: 300, overflow: "auto" }}
        >
          {descriptionMap.get(record.id) || "\u2014"}
        </Typography.Paragraph>
      ),
      rowExpandable: (record: JobGroup) => !!descriptionMap.get(record.id),
    }),
    [descriptionMap],
  );

  const visibleColumns = useMemo(
    () => settings.visibleColumns.filter((c) => EXPLORE_COLUMNS.has(c)),
    [settings.visibleColumns],
  );
  const columnOrder = useMemo(
    () => settings.columnOrder.filter((c) => EXPLORE_COLUMNS.has(c)),
    [settings.columnOrder],
  );

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : null;

  return (
    <Flex vertical gap={16}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Explore
      </Typography.Title>
      <ExploreFilters filters={filters} onChange={setFilters} />
      <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {totalElements} jobs {lastUpdated && `\u00B7 Updated ${lastUpdated}`}
        </Typography.Text>
        <Flex align="center" gap={2}>
          <Tooltip title="Refresh">
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined spin={isFetching} />}
              onClick={() => refetch()}
            />
          </Tooltip>
          <TableSettings
            settings={settings}
            onToggleColumn={toggleColumn}
            onRefreshChange={() => {}}
            onDensityChange={setDensity}
            availableColumns={EXPLORE_COLUMNS}
          />
        </Flex>
      </Flex>
      <div className="placeholder-fade" data-placeholder={isPlaceholderData}>
        <JobTable
          jobs={jobs}
          loading={isLoading}
          onSelect={() => {}}
          visibleColumns={visibleColumns}
          columnOrder={columnOrder}
          columnWidths={settings.columnWidths}
          onColumnResize={setColumnWidth}
          onColumnReorder={reorderColumns}
          density={settings.density}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
          expandable={expandable}
        />
      </div>
    </Flex>
  );
};
