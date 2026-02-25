import { Typography } from "antd";
import { APP_VERSION } from "@/config/constants";

export const AppVersion = () => (
  <Typography.Text type="secondary" style={{ fontSize: 11 }}>
    v{APP_VERSION}
  </Typography.Text>
);
