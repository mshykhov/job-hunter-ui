import { Flex, Typography, Empty } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import { StatCards } from "@/features/jobs/components/StatCards";

export const StatisticsPage = () => {
  const { statusCounts, totalElements } = useJobs({ period: "" }, 0);

  return (
    <Flex vertical gap={16}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Statistics
      </Typography.Title>
      <StatCards statusCounts={statusCounts} total={totalElements} />
      <Flex justify="center" align="center" style={{ minHeight: 300 }}>
        <Empty
          image={<BarChartOutlined style={{ fontSize: 48, color: "#8c8c8c" }} />}
          description="Charts and analytics coming soon"
        />
      </Flex>
    </Flex>
  );
};
