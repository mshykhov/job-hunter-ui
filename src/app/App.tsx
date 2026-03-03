import { Flex, Spin } from "antd";
import { useTheme } from "@/hooks/useTheme";
import { useAuthSetup } from "@/hooks/useAuthSetup";
import { AppProviders } from "./providers";
import { AppRoutes } from "./routes";

export const App = () => {
  const { isDark, toggle } = useTheme();
  const { isLoading, isConfigured } = useAuthSetup();

  if (isConfigured && isLoading) {
    return (
      <AppProviders isDark={isDark}>
        <Flex justify="center" align="center" style={{ minHeight: "100vh" }}>
          <Spin size="large" />
        </Flex>
      </AppProviders>
    );
  }

  return (
    <AppProviders isDark={isDark}>
      <AppRoutes isDark={isDark} onThemeToggle={toggle} />
    </AppProviders>
  );
};
