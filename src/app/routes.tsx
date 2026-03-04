import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { JobsPage } from "@/features/jobs/components/JobsPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { ExplorePage } from "@/features/explore/ExplorePage";
import { useAuth } from "@/hooks/useAuth";

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
