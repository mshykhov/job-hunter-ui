import { useLocation, useNavigate } from "react-router-dom";

import {
  AimOutlined,
  CompassOutlined,
  FileSearchOutlined,
  LineChartOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  RobotOutlined,
  SettingOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Badge, Button, Flex, Menu, theme, Typography } from "antd";

import { AppVersion } from "@/components/AppVersion";
import { PERMISSIONS, useAuth } from "@/hooks/useAuth";

interface NavigationMenuProps {
  collapsed: boolean;
  isDark: boolean;
  newJobsCount: number;
  onCollapse?: (collapsed: boolean) => void;
  onNavigate?: () => void;
  onThemeToggle: () => void;
}

export const NavigationMenu = ({
  collapsed,
  isDark,
  newJobsCount,
  onCollapse,
  onNavigate,
  onThemeToggle,
}: NavigationMenuProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const { isAuthenticated, isConfigured, permissions, user, loginWithRedirect, logout } = useAuth();
  const canReadJobs = !isConfigured || permissions.includes(PERMISSIONS.READ_JOBS);

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
          { key: "/statistics", icon: <LineChartOutlined />, label: "Statistics" },
        ]
      : []),
    ...(!isConfigured || permissions.includes(PERMISSIONS.READ_PREFERENCES)
      ? [{ key: "/settings", icon: <SettingOutlined />, label: "Settings" }]
      : []),
    ...(permissions.includes(PERMISSIONS.READ_AUTOMATION)
      ? [{ key: "/automation", icon: <RobotOutlined />, label: "Automation" }]
      : []),
  ];

  const navigateTo = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <Flex vertical justify="space-between" className="app-navigation">
      <div>
        <Flex
          vertical={collapsed}
          align="center"
          justify={collapsed ? "center" : "space-between"}
          gap={collapsed ? 8 : 0}
          className="app-navigation-brand"
        >
          <Flex align="center" gap={10}>
            <AimOutlined className="app-navigation-logo" style={{ color: token.colorPrimary }} />
            {!collapsed && <span className="app-navigation-name">Job Hunter</span>}
          </Flex>
          {onCollapse && (
            <Button
              type="text"
              size="small"
              aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => onCollapse(!collapsed)}
            />
          )}
        </Flex>

        <Menu
          mode="inline"
          theme={isDark ? "dark" : "light"}
          selectedKeys={[location.pathname]}
          items={navItems}
          onClick={({ key }) => navigateTo(key)}
          className="app-navigation-menu"
          style={{ borderInlineEnd: "none" }}
        />
      </div>

      <Flex
        vertical
        align={collapsed ? "center" : "start"}
        gap={8}
        className="app-navigation-footer"
      >
        {isConfigured && isAuthenticated && !collapsed && user?.email && (
          <Typography.Text type="secondary" ellipsis className="app-navigation-email">
            {user.email}
          </Typography.Text>
        )}
        {isConfigured && isAuthenticated && (
          <Button
            type="text"
            size="small"
            icon={<LogoutOutlined />}
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            {!collapsed && "Logout"}
          </Button>
        )}
        {isConfigured && !isAuthenticated && (
          <Button
            type="text"
            size="small"
            icon={<LoginOutlined />}
            onClick={() => loginWithRedirect()}
          >
            {!collapsed && "Sign In"}
          </Button>
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
  );
};
