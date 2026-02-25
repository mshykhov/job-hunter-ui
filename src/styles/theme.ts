import type { ThemeConfig } from "antd";
import { theme as antTheme } from "antd";

const ACCENT_COLOR = "#4F46E5";

export const darkTheme: ThemeConfig = {
  algorithm: antTheme.darkAlgorithm,
  token: {
    colorPrimary: ACCENT_COLOR,
    colorBgContainer: "#1A1A1D",
    colorBgLayout: "#0F0F10",
    colorBorderSecondary: "#2A2A2E",
    borderRadius: 6,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  },
};

export const lightTheme: ThemeConfig = {
  algorithm: antTheme.defaultAlgorithm,
  token: {
    colorPrimary: ACCENT_COLOR,
    colorBgContainer: "#FFFFFF",
    colorBgLayout: "#FAFAFA",
    borderRadius: 6,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  },
};
