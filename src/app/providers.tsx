import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import { App, ConfigProvider } from "antd";

import { ApiErrorHandler } from "@/components/ApiErrorHandler";
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
        <App>
          <ApiErrorHandler />
          <BrowserRouter>{children}</BrowserRouter>
        </App>
      </ConfigProvider>
    </QueryClientProvider>
  );
};
