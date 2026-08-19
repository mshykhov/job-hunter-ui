import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AutomationPage } from "@/features/automation/components/AutomationPage";
import { ExplorePage } from "@/features/explore/components/ExplorePage";
import { JobsPage } from "@/features/jobs/components/JobsPage";
import { SettingsPage } from "@/features/settings/components/SettingsPage";
import { PERMISSIONS, useAuth } from "@/hooks/useAuth";

interface AppRoutesProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

const RootRedirect = () => {
  const { isAuthenticated, isConfigured } = useAuth();
  const target = !isConfigured || isAuthenticated ? "/jobs" : "/explore";
  return <Navigate to={target} replace />;
};

export const AppRoutes = ({ isDark, onThemeToggle }: AppRoutesProps) => {
  return (
    <Routes>
      <Route element={<AppLayout isDark={isDark} onThemeToggle={onThemeToggle} />}>
        <Route index element={<RootRedirect />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route
          path="jobs"
          element={
            <ProtectedRoute>
              <JobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="automation"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.READ_AUTOMATION}>
              <AutomationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};
