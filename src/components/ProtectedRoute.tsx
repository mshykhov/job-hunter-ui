import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { Flex, Spin } from "antd";

import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute = ({ children, requiredPermission }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isConfigured, permissions } = useAuth();

  if (!isConfigured) {
    return requiredPermission ? <Navigate to="/explore" replace /> : <>{children}</>;
  }

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/explore" replace />;
  }

  if (requiredPermission && !permissions.includes(requiredPermission)) {
    return <Navigate to="/explore" replace />;
  }

  return <>{children}</>;
};
