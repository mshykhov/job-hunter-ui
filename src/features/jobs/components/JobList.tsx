import { Empty, Flex, Skeleton, Spin } from "antd";

import { useSourceNames } from "@/features/jobs/hooks/useSourceNames";
import type { JobGroup, UserJobStatus } from "@/features/jobs/types";

import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { JobRow } from "./JobRow";

interface JobListProps {
  jobs: JobGroup[];
  loading: boolean;
  statusPending: boolean;
  onSelect: (job: JobGroup) => void;
  onOpenPrimary: (job: JobGroup) => void;
  onStatusChange: (groupId: string, status: UserJobStatus) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

const SKELETON_ROWS = 8;

export const JobList = ({
  jobs,
  loading,
  statusPending,
  onSelect,
  onOpenPrimary,
  onStatusChange,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: JobListProps) => {
  const sourceNames = useSourceNames();
  const sentinelRef = useInfiniteScroll(onLoadMore, hasNextPage && !isFetchingNextPage);

  if (loading && jobs.length === 0) {
    return (
      <Flex vertical className="jobs-list">
        {Array.from({ length: SKELETON_ROWS }, (_, i) => (
          <div key={i} className="jobs-row jobs-row--skeleton">
            <Skeleton.Avatar active shape="circle" size={44} />
            <Skeleton active title paragraph={{ rows: 1, width: "60%" }} />
          </div>
        ))}
      </Flex>
    );
  }

  if (jobs.length === 0) {
    return (
      <Flex className="jobs-list jobs-list--empty" justify="center">
        <Empty description="No jobs match the current filters" />
      </Flex>
    );
  }

  return (
    <Flex vertical className="jobs-list">
      {jobs.map((job, index) => (
        <JobRow
          key={job.id}
          job={job}
          index={index}
          sourceNames={sourceNames}
          statusPending={statusPending}
          onSelect={onSelect}
          onOpenPrimary={onOpenPrimary}
          onStatusChange={onStatusChange}
        />
      ))}
      <div ref={sentinelRef} />
      {isFetchingNextPage && (
        <Flex justify="center" className="jobs-list-footer">
          <Spin size="small" />
        </Flex>
      )}
    </Flex>
  );
};
