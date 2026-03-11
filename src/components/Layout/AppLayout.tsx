import { useCallback, useEffect,useState } from "react";
import { Outlet } from "react-router-dom";

import { Layout } from "antd";

import { createStorage } from "@/lib/storage";

import { Sidebar, SIDEBAR_COLLAPSED_WIDTH,SIDEBAR_WIDTH } from "./Sidebar";

interface SidebarState {
  collapsed: boolean;
}

const storage = createStorage<SidebarState>("job-hunter-sidebar", 1, { collapsed: false });

interface AppLayoutProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

export const AppLayout = ({ isDark, onThemeToggle }: AppLayoutProps) => {
  const [collapsed, setCollapsed] = useState(() => storage.load().collapsed);

  useEffect(() => {
    storage.save({ collapsed });
  }, [collapsed]);

  const handleCollapse = useCallback((value: boolean) => {
    setCollapsed(value);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar
        collapsed={collapsed}
        onCollapse={handleCollapse}
        isDark={isDark}
        onThemeToggle={onThemeToggle}
        newJobsCount={0}
      />
      <Layout style={{ marginLeft: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH, transition: "margin-left 0.2s" }}>
        <Layout.Content style={{ padding: 24, minHeight: "100vh" }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
