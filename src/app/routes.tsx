import { Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LandingPage } from "@/features/landing/LandingPage";
import { JobsPage } from "@/features/jobs/components/JobsPage";
import { StatisticsPage } from "@/features/statistics/StatisticsPage";
import { SettingsPage } from "@/features/settings/SettingsPage";

interface AppRoutesProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

export const AppRoutes = ({ isDark, onThemeToggle }: AppRoutesProps) => {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route element={<AppLayout isDark={isDark} onThemeToggle={onThemeToggle} />}>
        <Route path="statistics" element={<StatisticsPage />} />
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
