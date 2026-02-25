import { useState } from "react";
import { Flex, Typography } from "antd";
import type { Job, JobFilters as JobFiltersType, UserJobStatus } from "../types";
import { useJobs, filterJobsLocally } from "../hooks/useJobs";
import { useJobStatus } from "../hooks/useJobStatus";
import { useTableSettings } from "../hooks/useTableSettings";
import { JobFilters } from "./JobFilters";
import { JobTable } from "./JobTable";
import { JobSidePanel } from "./JobSidePanel";
import { TableToolbar } from "./TableToolbar";

export const JobsPage = () => {
  const [filters, setFilters] = useState<JobFiltersType>({});
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { settings, toggleColumn, setRefreshInterval, setDensity } = useTableSettings();

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
      }
    );
  };

  return (
    <Flex vertical gap={16}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Jobs
      </Typography.Title>
      <JobFilters filters={filters} onChange={setFilters} />
      <Flex gap={16}>
        <div style={{ flex: 1, minWidth: 0 }}>
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
          <div
            style={{
              width: 360,
              flexShrink: 0,
              borderLeft: "1px solid var(--ant-color-border-secondary, #2A2A2E)",
            }}
          >
            <JobSidePanel
              job={selectedJob}
              onStatusChange={handleStatusChange}
              loading={statusMutation.isPending}
            />
          </div>
        )}
      </Flex>
    </Flex>
  );
};
