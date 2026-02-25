import { Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/Layout/AppLayout";
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
      <Route element={<AppLayout isDark={isDark} onThemeToggle={onThemeToggle} />}>
        <Route index element={<JobsPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};
