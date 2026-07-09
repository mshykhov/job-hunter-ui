import { ReloadOutlined } from "@ant-design/icons";
import { Button, Flex, Tooltip, Typography } from "antd";

import { usePublicJobs } from "@/features/jobs/hooks/usePublicJobs";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import { useExploreFilters } from "../hooks/useExploreFilters";
import { ExploreFilters } from "./ExploreFilters";
import { ExploreList } from "./ExploreList";

export const ExplorePage = () => {
  const { filters, setFilters } = useExploreFilters();
  const debouncedFilters = useDebouncedValue(filters, 300);

  const {
    jobs,
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

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : null;

  return (
    <Flex vertical gap={16}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Explore
      </Typography.Title>
      <div className="jobs-sticky">
        <ExploreFilters filters={filters} onChange={setFilters} />
        <Flex justify="space-between" align="center" className="jobs-toolbar">
          <Typography.Text type="secondary" className="jobs-toolbar-count">
            {totalElements} jobs{lastUpdated && ` · updated ${lastUpdated}`}
          </Typography.Text>
          <Tooltip title="Refresh">
            <Button type="text" icon={<ReloadOutlined spin={isFetching} />} onClick={() => refetch()} />
          </Tooltip>
        </Flex>
      </div>
      <div className="placeholder-fade" data-placeholder={isPlaceholderData}>
        <ExploreList
          jobs={jobs}
          loading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      </div>
    </Flex>
  );
};
