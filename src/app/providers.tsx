import type { ReactNode } from "react";
import { ConfigProvider } from "antd";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";
import { darkTheme, lightTheme } from "@/styles/theme";

interface AppProvidersProps {
  children: ReactNode;
  isDark: boolean;
}

export const AppProviders = ({ children, isDark }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={isDark ? darkTheme : lightTheme}>
        <BrowserRouter>{children}</BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
};
