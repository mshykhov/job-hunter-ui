import { Layout, Menu, Button, Badge, Flex, theme } from "antd";
import {
  FileSearchOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
  AimOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { AppVersion } from "@/components/AppVersion";

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  newJobsCount: number;
}

const NAV_ITEMS = [
  { key: "/", icon: <FileSearchOutlined />, label: "Jobs" },
  { key: "/statistics", icon: <BarChartOutlined />, label: "Statistics" },
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

  const menuItems = NAV_ITEMS.map((item) => ({
    ...item,
    icon:
      item.key === "/" ? (
        <Badge count={newJobsCount} size="small" offset={[6, 0]}>
          {item.icon}
        </Badge>
      ) : (
        item.icon
      ),
  }));

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

          {collapsed && (
            <Flex justify="center" style={{ marginBottom: 12 }}>
              <Button
                type="text"
                size="small"
                icon={<MenuUnfoldOutlined />}
                onClick={() => onCollapse(false)}
              />
            </Flex>
          )}

          <Menu
            mode="inline"
            theme={isDark ? "dark" : "light"}
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ borderInlineEnd: "none" }}
          />
        </div>

        <Flex vertical align={collapsed ? "center" : "start"} gap={8} style={{ padding: "0 16px" }}>
          <Button
            type="text"
            size="small"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={onThemeToggle}
          >
            {!collapsed && (isDark ? "Light" : "Dark")}
          </Button>
          <AppVersion />
        </Flex>
      </Flex>
    </Layout.Sider>
  );
};
