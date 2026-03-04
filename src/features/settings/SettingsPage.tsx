import { Flex, Tabs, Typography } from "antd";
import { SETTINGS_TABS } from "./constants";
import { JobPreferencesTab } from "./tabs/JobPreferencesTab";
import { AiConfigTab } from "./tabs/AiConfigTab";
import { TelegramTab } from "./tabs/TelegramTab";

export const SettingsPage = () => {
  const tabItems = [
    { key: SETTINGS_TABS.JOB_PREFERENCES, label: "Job Preferences", children: <JobPreferencesTab /> },
    { key: SETTINGS_TABS.AI_CONFIG, label: "AI Configuration", children: <AiConfigTab /> },
    { key: SETTINGS_TABS.TELEGRAM, label: "Telegram", children: <TelegramTab /> },
  ];

  return (
    <Flex vertical gap={16}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Settings
      </Typography.Title>
      <Tabs items={tabItems} />
    </Flex>
  );
};
