import { useEffect, type ReactNode } from "react";
import { Flex, Spin } from "antd";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isConfigured, loginWithRedirect } = useAuth();

  useEffect(() => {
    if (isConfigured && !isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isConfigured, isLoading, isAuthenticated, loginWithRedirect]);

  if (!isConfigured) return <>{children}</>;

  if (isLoading || !isAuthenticated) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return <>{children}</>;
};
