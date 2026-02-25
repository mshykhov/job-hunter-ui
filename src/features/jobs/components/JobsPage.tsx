import { useState } from "react";
import { Flex, Typography } from "antd";
import type { Job, JobFilters as JobFiltersType } from "../types";
import { useJobs, filterJobsLocally } from "../hooks/useJobs";
import { useJobStatus } from "../hooks/useJobStatus";
import { StatCards } from "./StatCards";
import { JobFilters } from "./JobFilters";
import { JobTable } from "./JobTable";
import { JobSidePanel } from "./JobSidePanel";

export const JobsPage = () => {
  const [filters, setFilters] = useState<JobFiltersType>({});
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { data: jobs = [], isLoading } = useJobs(filters);
  const statusMutation = useJobStatus();

  const filteredJobs = filterJobsLocally(jobs, filters);

  const handleSelect = (job: Job) => {
    setSelectedJob(job.id === selectedJob?.id ? null : job);
  };

  const handleStatusChange = (jobId: string, status: Job["status"]) => {
    statusMutation.mutate(
      { jobId, status },
      {
        onSuccess: (updated) => {
          if (selectedJob?.id === updated.id) setSelectedJob(updated);
        },
      }
    );
  };

  return (
    <Flex vertical gap={16}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Jobs
      </Typography.Title>
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
