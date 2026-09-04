import { AimOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, Drawer, Flex, Layout, theme, Typography } from "antd";

import { NavigationMenu } from "./NavigationMenu";

interface MobileNavigationProps {
  open: boolean;
  isDark: boolean;
  newJobsCount: number;
  onOpen: () => void;
  onClose: () => void;
  onThemeToggle: () => void;
}

export const MobileNavigation = ({
  open,
  isDark,
  newJobsCount,
  onOpen,
  onClose,
  onThemeToggle,
}: MobileNavigationProps) => {
  const { token } = theme.useToken();

  return (
    <>
      <Layout.Header className="app-mobile-header">
        <Button type="text" aria-label="Open navigation" icon={<MenuOutlined />} onClick={onOpen} />
        <Flex align="center" gap={8}>
          <AimOutlined style={{ color: token.colorPrimary }} />
          <Typography.Text strong>Job Hunter</Typography.Text>
        </Flex>
        <span className="app-mobile-header-spacer" aria-hidden="true" />
      </Layout.Header>
      <Drawer
        title="Navigation"
        placement="left"
        size={280}
        open={open}
        onClose={onClose}
        className="app-mobile-drawer"
        styles={{ body: { padding: 0 } }}
      >
        <NavigationMenu
          collapsed={false}
          isDark={isDark}
          newJobsCount={newJobsCount}
          onNavigate={onClose}
          onThemeToggle={onThemeToggle}
        />
      </Drawer>
    </>
  );
};
