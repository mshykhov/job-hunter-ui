import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { registerTokenGetter, registerAuthErrorHandler } from "@/lib/api";

export const useAuthSetup = () => {
  const { isConfigured, isLoading, getAccessTokenSilently, loginWithRedirect } = useAuth();

  useEffect(() => {
    if (!isConfigured) return;

    const cleanupToken = registerTokenGetter(() => getAccessTokenSilently());
    const cleanupAuth = registerAuthErrorHandler(() => {
      loginWithRedirect();
    });

    return () => {
      cleanupToken();
      cleanupAuth();
    };
  }, [isConfigured, getAccessTokenSilently, loginWithRedirect]);

  return { isLoading, isConfigured };
};
