import { useState } from "react";

import { Empty, Flex, Skeleton, Spin } from "antd";

import { useInfiniteScroll } from "@/features/jobs/hooks/useInfiniteScroll";
import { useSourceNames } from "@/features/jobs/hooks/useSourceNames";
import type { PublicJob } from "@/features/jobs/types";

import { ExploreRow } from "./ExploreRow";

interface ExploreListProps {
  jobs: PublicJob[];
  loading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

const SKELETON_ROWS = 8;

export const ExploreList = ({
  jobs,
  loading,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: ExploreListProps) => {
  const sourceNames = useSourceNames();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sentinelRef = useInfiniteScroll(onLoadMore, hasNextPage && !isFetchingNextPage);

  const toggle = (id: string) => setExpandedId((current) => (current === id ? null : id));

  if (loading && jobs.length === 0) {
    return (
      <Flex vertical className="jobs-list">
        {Array.from({ length: SKELETON_ROWS }, (_, i) => (
          <div key={i} className="jobs-row jobs-row--skeleton">
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
        <ExploreRow
          key={job.id}
          job={job}
          index={index}
          sourceNames={sourceNames}
          expanded={expandedId === job.id}
          onToggle={toggle}
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
