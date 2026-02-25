import { useState, useCallback, useEffect } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { createStorage } from "@/lib/storage";

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
      <Layout style={{ marginLeft: collapsed ? 60 : 220, transition: "margin-left 0.2s" }}>
        <Layout.Content style={{ padding: 24, minHeight: "100vh" }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
