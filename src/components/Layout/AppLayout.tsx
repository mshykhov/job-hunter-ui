import { type CSSProperties, useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { Layout } from "antd";

import { createStorage } from "@/lib/storage";

import { MobileNavigation } from "./MobileNavigation";
import { Sidebar, SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH } from "./Sidebar";

interface SidebarState {
  collapsed: boolean;
}

const storage = createStorage<SidebarState>("job-hunter-sidebar", 1, { collapsed: false });
const initialSidebarCollapsed = () => storage.load().collapsed;

interface AppLayoutProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

export const AppLayout = ({ isDark, onThemeToggle }: AppLayoutProps) => {
  const [collapsed, setCollapsed] = useState(initialSidebarCollapsed);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

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
      <MobileNavigation
        open={mobileNavigationOpen}
        isDark={isDark}
        newJobsCount={0}
        onOpen={() => setMobileNavigationOpen(true)}
        onClose={() => setMobileNavigationOpen(false)}
        onThemeToggle={onThemeToggle}
      />
      <Layout
        className="app-shell-content"
        style={
          {
            "--app-sidebar-width": `${collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH}px`,
          } as CSSProperties
        }
      >
        <main className="app-main">
          <Outlet />
        </main>
      </Layout>
    </Layout>
  );
};
