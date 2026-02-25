import { useTheme } from "@/hooks/useTheme";
import { AppProviders } from "./providers";
import { AppRoutes } from "./routes";

export const App = () => {
  const { isDark, toggle } = useTheme();

  return (
    <AppProviders isDark={isDark}>
      <AppRoutes isDark={isDark} onThemeToggle={toggle} />
    </AppProviders>
  );
};
