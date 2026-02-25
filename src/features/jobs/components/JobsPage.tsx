import { useState } from "react";
import { Button, Flex, Tooltip, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import type { Job, JobFilters as JobFiltersType, UserJobStatus } from "../types";
import { useJobs, filterJobsLocally } from "../hooks/useJobs";
import { useJobStatus } from "../hooks/useJobStatus";
import { StatCards } from "./StatCards";
import { JobFilters } from "./JobFilters";
import { JobTable } from "./JobTable";
import { JobSidePanel } from "./JobSidePanel";

export const JobsPage = () => {
  const [filters, setFilters] = useState<JobFiltersType>({});
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { data: jobs = [], isLoading, isFetching, refetch, dataUpdatedAt } = useJobs(filters);
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

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : null;

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center">
        <Typography.Title level={4} style={{ margin: 0 }}>
          Jobs
        </Typography.Title>
        <Flex align="center" gap={8}>
          {lastUpdated && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Updated {lastUpdated}
            </Typography.Text>
          )}
          <Tooltip title="Refresh">
            <Button
              type="text"
              icon={<ReloadOutlined spin={isFetching} />}
              onClick={() => refetch()}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <StatCards jobs={filteredJobs} />
      <JobFilters filters={filters} onChange={setFilters} />
      <Flex gap={16}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <JobTable
            jobs={filteredJobs}
            loading={isLoading}
            selectedJobId={selectedJob?.id ?? null}
            onSelect={handleSelect}
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
