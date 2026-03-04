import { useMemo } from "react";
import { Button, Flex, Tooltip, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { usePublicJobs, mapPublicJobToTableRow } from "@/features/jobs/hooks/usePublicJobs";
import { useTableSettings, type ColumnKey } from "@/features/jobs/hooks/useTableSettings";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { JobTable } from "@/features/jobs/components/JobTable";
import { TableSettings } from "@/features/jobs/components/TableSettings";
import { ExploreFilters } from "./ExploreFilters";
import { useExploreFilters } from "./useExploreFilters";

const EXPLORE_COLUMNS: Set<ColumnKey> = new Set([
  "title", "company", "source", "salary", "location", "remote", "publishedAt",
]);

export const ExplorePage = () => {
  const { filters, setFilters } = useExploreFilters();

  const { settings, toggleColumn, setColumnWidth, setDensity, reorderColumns } =
    useTableSettings();

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
      <div style={{ opacity: isPlaceholderData ? 0.6 : 1, transition: "opacity 0.2s" }}>
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
        />
      </div>
    </Flex>
  );
};
