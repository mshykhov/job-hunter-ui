import { useState } from "react";
import { Flex, Typography } from "antd";
import type { Job, UserJobStatus } from "../types";
import { useJobs, filterJobsLocally } from "../hooks/useJobs";
import { useJobStatus } from "../hooks/useJobStatus";
import { useJobFilters } from "../hooks/useJobFilters";
import { useTableSettings } from "../hooks/useTableSettings";
import { useResizablePanel } from "../hooks/useResizablePanel";
import { JobFilters } from "./JobFilters";
import { JobTable } from "./JobTable";
import { JobDetailPanel } from "./JobDetailPanel";
import { TableToolbar } from "./TableToolbar";

export const JobsPage = () => {
  const { filters, setFilters } = useJobFilters();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { settings, toggleColumn, setRefreshInterval, setDensity } = useTableSettings();
  const { width: panelWidth, onDragStart } = useResizablePanel();

  const {
    data: jobs = [],
    isLoading,
    isFetching,
    refetch,
    dataUpdatedAt,
  } = useJobs(filters, settings.refreshInterval);

  const statusMutation = useJobStatus();
  const filteredJobs = filterJobsLocally(jobs, filters);

  const handleSelect = (job: Job) => {
    setSelectedJob(job.id === selectedJob?.id ? null : job);
  };

  const handleStatusChange = (jobId: string, status: UserJobStatus) => {
    statusMutation.mutate(
      { jobId, status },
      {
        onSuccess: (updated) => {
          if (selectedJob?.jobId === updated.jobId) setSelectedJob(updated);
        },
      },
    );
  };

  return (
    <Flex vertical gap={16}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Jobs
      </Typography.Title>
      <JobFilters filters={filters} onChange={setFilters} />
      <Flex style={{ height: "calc(100vh - 200px)" }}>
        <div style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
          <TableToolbar
            total={filteredJobs.length}
            isFetching={isFetching}
            dataUpdatedAt={dataUpdatedAt}
            onRefresh={() => refetch()}
            settings={settings}
            onToggleColumn={toggleColumn}
            onRefreshChange={setRefreshInterval}
            onDensityChange={setDensity}
          />
          <JobTable
            jobs={filteredJobs}
            loading={isLoading}
            selectedJobId={selectedJob?.id ?? null}
            onSelect={handleSelect}
            visibleColumns={settings.visibleColumns}
            density={settings.density}
          />
        </div>
        {selectedJob && (
          <>
            <div className="resize-handle" onMouseDown={onDragStart} />
            <div
              style={{
                width: panelWidth,
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <JobDetailPanel
                job={selectedJob}
                onClose={() => setSelectedJob(null)}
                onStatusChange={handleStatusChange}
                statusLoading={statusMutation.isPending}
              />
            </div>
          </>
        )}
      </Flex>
    </Flex>
  );
};
