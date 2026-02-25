import { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

export const AppLayout = ({ isDark, onThemeToggle }: AppLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
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
