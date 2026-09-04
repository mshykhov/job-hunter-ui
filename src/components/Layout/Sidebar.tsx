import { Layout, theme } from "antd";

import { NavigationMenu } from "./NavigationMenu";

export const SIDEBAR_WIDTH = 208;
export const SIDEBAR_COLLAPSED_WIDTH = 52;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  newJobsCount: number;
}

export const Sidebar = ({
  collapsed,
  onCollapse,
  isDark,
  onThemeToggle,
  newJobsCount,
}: SidebarProps) => {
  const { token } = theme.useToken();

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={SIDEBAR_WIDTH}
      collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
      theme={isDark ? "dark" : "light"}
      className="app-sidebar"
      style={{
        position: "fixed",
        inset: "0 auto 0 0",
        zIndex: 10,
        height: "100vh",
        borderRight: isDark ? "none" : `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <NavigationMenu
        collapsed={collapsed}
        isDark={isDark}
        newJobsCount={newJobsCount}
        onCollapse={onCollapse}
        onThemeToggle={onThemeToggle}
      />
    </Layout.Sider>
  );
};
