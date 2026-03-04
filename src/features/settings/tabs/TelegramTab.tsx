import { Card, Flex, Typography } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

export const TelegramTab = () => (
  <Card size="small">
    <Flex vertical align="center" gap={12} style={{ padding: "40px 0" }}>
      <ClockCircleOutlined style={{ fontSize: 32, opacity: 0.4 }} />
      <Typography.Title level={5} style={{ margin: 0, opacity: 0.6 }}>
        Coming Soon
      </Typography.Title>
      <Typography.Text type="secondary" style={{ textAlign: "center", maxWidth: 320 }}>
        Telegram bot integration and notification settings will be available here.
      </Typography.Text>
    </Flex>
  </Card>
);
