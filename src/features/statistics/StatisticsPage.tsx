import { Flex, Typography, Empty } from "antd";
import { BarChartOutlined } from "@ant-design/icons";

export const StatisticsPage = () => {
  return (
    <Flex vertical gap={16}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Statistics
      </Typography.Title>
      <Flex justify="center" align="center" style={{ minHeight: 400 }}>
        <Empty
          image={<BarChartOutlined style={{ fontSize: 48, color: "#8c8c8c" }} />}
          description="Charts and analytics coming soon"
        />
      </Flex>
    </Flex>
  );
};
