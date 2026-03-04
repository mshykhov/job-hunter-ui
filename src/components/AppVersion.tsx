import { Flex, theme } from "antd";
import { useQuery } from "@tanstack/react-query";
import { APP_VERSION } from "@/config/constants";
import { api, API_PATHS } from "@/lib/api";

interface ApiVersionResponse {
  version: string;
  name: string;
}

const useApiVersion = () =>
  useQuery({
    queryKey: ["api-version"],
    queryFn: async () => {
      const { data } = await api.get<ApiVersionResponse>(API_PATHS.PUBLIC_VERSION, {
        skipErrorHandler: true,
      });
      return data;
    },
    staleTime: 600_000,
    retry: false,
  });

export const AppVersion = () => {
  const { token } = theme.useToken();
  const { data: apiVersion } = useApiVersion();

  const style = { fontSize: 11, color: token.colorTextQuaternary };

  return (
    <Flex gap={8} style={style}>
      <span>ui: {APP_VERSION}</span>
      {apiVersion && <span>api: {apiVersion.version}</span>}
    </Flex>
  );
};
