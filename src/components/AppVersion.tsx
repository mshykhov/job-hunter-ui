import { theme } from "antd";
import { APP_VERSION } from "@/config/constants";

export const AppVersion = () => {
  const { token } = theme.useToken();

  return (
    <span style={{ fontSize: 11, color: token.colorTextTertiary, whiteSpace: "nowrap" }}>
      v{APP_VERSION}
    </span>
  );
};
