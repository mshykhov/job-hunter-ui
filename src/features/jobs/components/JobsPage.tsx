import { Flex, Typography } from "antd";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import { useJobFilters } from "../hooks/useJobFilters";
import { useJobs } from "../hooks/useJobs";
import { useJobStatus } from "../hooks/useJobStatus";
import { useRematch } from "../hooks/useRematch";
import { useReviewMode } from "../hooks/useReviewMode";
import { useTableSettings } from "../hooks/useTableSettings";
import type { JobGroup, UserJobStatus } from "../types";
import { JobFilters } from "./JobFilters";
import { JobReviewCard } from "./JobReviewCard";
import { JobTable } from "./JobTable";
import { TableToolbar } from "./TableToolbar";

export const JobsPage = () => {
  const { filters, setFilters } = useJobFilters();

  const { settings, toggleColumn, setColumnWidth, setRefreshInterval, setDensity, reorderColumns } =
    useTableSettings();

  const debouncedFilters = useDebouncedValue(filters, 300);

  const {
    jobs,
    statusCounts,
    totalElements,
    isLoading,
    isFetching,
    isPlaceholderData,
    refetch,
    dataUpdatedAt,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useJobs(debouncedFilters, settings.refreshInterval);

  const statusMutation = useJobStatus();
  const rematchMutation = useRematch();
  const reviewMode = useReviewMode();

  const handleEnterReview = (job: JobGroup) => {
    if (jobs.length > 0) {
      const pagesLoaded = Math.ceil(jobs.length / (debouncedFilters.size ?? 50));
      reviewMode.enter(jobs, job, totalElements, debouncedFilters, !!hasNextPage, pagesLoaded);
    }
  };

  const handleStatusChange = (groupId: string, status: UserJobStatus) => {
    statusMutation.mutate(
      { groupId, status },
      {
        onSuccess: (updated) => {
          if (reviewMode.isActive) reviewMode.advanceWithUpdate(updated);
        },
      },
    );
  };

  if (reviewMode.isActive && reviewMode.currentJob) {
    return (
      <Flex vertical gap={16}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Jobs
        </Typography.Title>
        <JobReviewCard
          job={reviewMode.currentJob}
          currentIndex={reviewMode.currentIndex}
          total={reviewMode.total}
          hasPrev={reviewMode.hasPrev}
          hasNext={reviewMode.hasNext}
          onPrev={reviewMode.goPrev}
          onNext={reviewMode.goNext}
          onClose={reviewMode.exit}
          onStatusChange={handleStatusChange}
          statusLoading={statusMutation.isPending}
          loading={reviewMode.isPageLoading}
        />
      </Flex>
    );
  }

  return (
    <Flex vertical gap={16}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Jobs
      </Typography.Title>
      <JobFilters filters={filters} onChange={setFilters} statusCounts={statusCounts} />
      <TableToolbar
        total={totalElements}
        isFetching={isFetching}
        dataUpdatedAt={dataUpdatedAt}
        onRefresh={() => refetch()}
        onRematch={(since) => rematchMutation.mutate(since)}
        rematchLoading={rematchMutation.isPending}
        settings={settings}
        onToggleColumn={toggleColumn}
        onRefreshChange={setRefreshInterval}
        onDensityChange={setDensity}
        onReview={() => handleEnterReview(jobs[0])}
        reviewDisabled={jobs.length === 0}
      />
      <div className="placeholder-fade" data-placeholder={isPlaceholderData}>
        <JobTable
          jobs={jobs}
          loading={isLoading}
          onSelect={handleEnterReview}
          visibleColumns={settings.visibleColumns}
          columnOrder={settings.columnOrder}
          columnWidths={settings.columnWidths}
          onColumnResize={setColumnWidth}
          onColumnReorder={reorderColumns}
          density={settings.density}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      </div>
    </Flex>
  );
};
