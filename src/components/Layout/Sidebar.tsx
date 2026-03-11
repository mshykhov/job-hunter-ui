import { useLocation, useNavigate } from "react-router-dom";

import {
  AimOutlined,
  CompassOutlined,
  FileSearchOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SettingOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Badge, Button, Flex, Layout, Menu, theme,Typography } from "antd";

import { AppVersion } from "@/components/AppVersion";
import { PERMISSIONS,useAuth } from "@/hooks/useAuth";

export const SIDEBAR_WIDTH = 220;
export const SIDEBAR_COLLAPSED_WIDTH = 60;

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
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const { isAuthenticated, isConfigured, permissions, user, loginWithRedirect, logout } = useAuth();

  const canReadJobs = !isConfigured || permissions.includes(PERMISSIONS.READ_JOBS);
  const canReadPreferences = !isConfigured || permissions.includes(PERMISSIONS.READ_PREFERENCES);

  const navItems = [
    { key: "/explore", icon: <CompassOutlined />, label: "Explore" },
    ...(canReadJobs
      ? [
          {
            key: "/jobs",
            icon: (
              <Badge count={newJobsCount} size="small" offset={[6, 0]}>
                <FileSearchOutlined />
              </Badge>
            ),
            label: "Jobs",
          },
        ]
      : []),
    ...(canReadPreferences
      ? [{ key: "/settings", icon: <SettingOutlined />, label: "Settings" }]
      : []),
  ];

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      trigger={null}
      width={SIDEBAR_WIDTH}
      collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
      theme={isDark ? "dark" : "light"}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 10,
        borderRight: isDark ? "none" : `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Flex vertical justify="space-between" style={{ height: "100%", padding: "12px 0" }}>
        <div>
          <Flex
            align="center"
            justify={collapsed ? "center" : "space-between"}
            style={{ padding: "0 16px", marginBottom: 24 }}
          >
            <Flex align="center" gap={10}>
              <AimOutlined style={{ fontSize: 22, color: token.colorPrimary }} />
              {!collapsed && (
                <span style={{ fontSize: 16, fontWeight: 700, whiteSpace: "nowrap", color: token.colorText, letterSpacing: -0.3 }}>
                  Job Hunter
                </span>
              )}
            </Flex>
            {!collapsed && (
              <Button
                type="text"
                size="small"
                icon={<MenuFoldOutlined />}
                onClick={() => onCollapse(true)}
              />
            )}
          </Flex>

          <Menu
            mode="inline"
            theme={isDark ? "dark" : "light"}
            selectedKeys={[location.pathname]}
            items={navItems}
            onClick={({ key }) => navigate(key)}
            style={{ borderInlineEnd: "none" }}
          />
        </div>

        <Flex
          vertical
          align={collapsed ? "center" : "start"}
          gap={8}
          style={{ padding: "0 16px" }}
        >
          {isConfigured && isAuthenticated && !collapsed && user?.email && (
            <Typography.Text
              type="secondary"
              ellipsis
              style={{ fontSize: 12, maxWidth: "100%" }}
            >
              {user.email}
            </Typography.Text>
          )}
          {isConfigured && isAuthenticated && (
            <Button type="text" size="small" icon={<LogoutOutlined />}
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              {!collapsed && "Logout"}
            </Button>
          )}
          {isConfigured && !isAuthenticated && (
            <Button type="text" size="small" icon={<LoginOutlined />} onClick={() => loginWithRedirect()}>
              {!collapsed && "Sign In"}
            </Button>
          )}
          {collapsed && (
            <Button
              type="text"
              size="small"
              icon={<MenuUnfoldOutlined />}
              onClick={() => onCollapse(false)}
            />
          )}
          <Button
            type="text"
            size="small"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={onThemeToggle}
          >
            {!collapsed && (isDark ? "Light" : "Dark")}
          </Button>
          {!collapsed && <AppVersion />}
        </Flex>
      </Flex>
    </Layout.Sider>
  );
};
