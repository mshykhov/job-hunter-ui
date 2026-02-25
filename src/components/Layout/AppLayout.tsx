import { useState, useCallback } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

const SIDEBAR_KEY = "job-hunter-sidebar-collapsed";

const loadCollapsed = (): boolean => {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === "true";
  } catch {
    return false;
  }
};

interface AppLayoutProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

export const AppLayout = ({ isDark, onThemeToggle }: AppLayoutProps) => {
  const [collapsed, setCollapsed] = useState(loadCollapsed);

  const handleCollapse = useCallback((value: boolean) => {
    setCollapsed(value);
    localStorage.setItem(SIDEBAR_KEY, String(value));
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
