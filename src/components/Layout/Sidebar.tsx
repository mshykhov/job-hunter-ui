import { Layout, Menu, Button, Badge, Flex, Typography, theme } from "antd";
import {
  FileSearchOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
  AimOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { AppVersion } from "@/components/AppVersion";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  newJobsCount: number;
}

const PUBLIC_NAV_ITEMS = [
  { key: "/statistics", icon: <BarChartOutlined />, label: "Statistics" },
];

const PROTECTED_NAV_ITEMS = [
  { key: "/jobs", icon: <FileSearchOutlined />, label: "Jobs" },
  { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
];

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
  const { isAuthenticated, isConfigured, user, loginWithRedirect, logout } = useAuth();

  const showProtected = !isConfigured || isAuthenticated;

  const navItems = [
    ...(showProtected
      ? PROTECTED_NAV_ITEMS.map((item) => ({
          ...item,
          icon:
            item.key === "/jobs" ? (
              <Badge count={newJobsCount} size="small" offset={[6, 0]}>
                {item.icon}
              </Badge>
            ) : (
              item.icon
            ),
        }))
      : []),
    ...PUBLIC_NAV_ITEMS,
  ];

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      trigger={null}
      width={220}
      collapsedWidth={60}
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
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    color: token.colorText,
                    letterSpacing: -0.3,
                  }}
                >
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
          {isConfigured &&
            (isAuthenticated ? (
              <Button
                type="text"
                size="small"
                icon={<LogoutOutlined />}
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              >
                {!collapsed && "Logout"}
              </Button>
            ) : (
              <Button
                type="text"
                size="small"
                icon={<LoginOutlined />}
                onClick={() => loginWithRedirect()}
              >
                {!collapsed && "Sign In"}
              </Button>
            ))}
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
