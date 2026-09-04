import type { ThemeConfig } from "antd";
import { theme as antTheme } from "antd";

const ACCENT_COLOR = "#4F46E5";

const FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';

export const darkTheme: ThemeConfig = {
  algorithm: antTheme.darkAlgorithm,
  token: {
    colorPrimary: ACCENT_COLOR,
    colorLink: "#818CF8",
    colorLinkActive: "#6366F1",
    colorLinkHover: "#A5B4FC",
    colorTextSecondary: "#8C8C91",
    colorTextDescription: "#8C8C91",
    borderRadius: 6,
    fontFamily: FONT_FAMILY,
  },
  components: {
    Layout: {
      siderBg: "#141417",
      bodyBg: "#0F0F12",
      headerBg: "#141417",
      triggerBg: "#1F1F23",
    },
    Menu: {
      darkItemBg: "transparent",
      darkSubMenuItemBg: "transparent",
      darkItemSelectedBg: "rgba(79, 70, 229, 0.15)",
      darkItemHoverBg: "rgba(255, 255, 255, 0.06)",
    },
    Card: {
      colorBgContainer: "#1A1A1E",
      colorBorderSecondary: "#2A2A2E",
    },
    Descriptions: {
      labelColor: "#8C8C91",
    },
    Table: {
      colorBgContainer: "#1A1A1E",
      headerBg: "#1F1F23",
      rowHoverBg: "rgba(255, 255, 255, 0.04)",
      borderColor: "#2A2A2E",
    },
    Select: {
      colorBgContainer: "#1A1A1E",
    },
    Input: {
      colorBgContainer: "#1A1A1E",
    },
  },
};

export const lightTheme: ThemeConfig = {
  algorithm: antTheme.defaultAlgorithm,
  token: {
    colorPrimary: ACCENT_COLOR,
    borderRadius: 6,
    fontFamily: FONT_FAMILY,
  },
  components: {
    Layout: {
      siderBg: "#FFFFFF",
      bodyBg: "#F5F5F7",
      headerBg: "#FFFFFF",
    },
    Menu: {
      itemBg: "transparent",
      subMenuItemBg: "transparent",
      itemSelectedBg: "rgba(79, 70, 229, 0.08)",
      itemHoverBg: "rgba(0, 0, 0, 0.04)",
    },
    Card: {
      colorBgContainer: "#FFFFFF",
    },
    Table: {
      colorBgContainer: "#FFFFFF",
      headerBg: "#FAFAFA",
    },
  },
};
