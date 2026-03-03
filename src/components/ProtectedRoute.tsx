import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Flex, Spin } from "antd";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isConfigured } = useAuth();

  if (!isConfigured) return <>{children}</>;

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
};
