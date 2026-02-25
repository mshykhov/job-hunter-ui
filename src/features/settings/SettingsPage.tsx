import { Flex, Typography, Empty } from "antd";
import { SettingOutlined } from "@ant-design/icons";

export const SettingsPage = () => {
  return (
    <Flex vertical gap={16}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Settings
      </Typography.Title>
      <Flex justify="center" align="center" style={{ minHeight: 400 }}>
        <Empty
          image={<SettingOutlined style={{ fontSize: 48, color: "#8c8c8c" }} />}
          description="Preferences and notifications coming soon"
        />
      </Flex>
    </Flex>
  );
};
