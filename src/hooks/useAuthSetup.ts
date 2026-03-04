import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { registerTokenGetter, registerAuthErrorHandler } from "@/lib/api";

export const useAuthSetup = () => {
  const { isConfigured, isLoading, isAuthenticated, getAccessTokenSilently, loginWithRedirect } =
    useAuth();

  useEffect(() => {
    if (!isConfigured || !isAuthenticated) return;

    const cleanupToken = registerTokenGetter(() => getAccessTokenSilently());
    const cleanupAuth = registerAuthErrorHandler(() => {
      loginWithRedirect();
    });

    return () => {
      cleanupToken();
      cleanupAuth();
    };
  }, [isConfigured, isAuthenticated, getAccessTokenSilently, loginWithRedirect]);

  return { isLoading, isConfigured };
};
