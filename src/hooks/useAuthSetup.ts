import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { registerAuthErrorHandler,registerTokenGetter, registerTokenRefresher } from "@/lib/api";

export const useAuthSetup = () => {
  const { isConfigured, isLoading, isAuthenticated, getAccessTokenSilently, logout } = useAuth();

  useEffect(() => {
    if (!isConfigured || !isAuthenticated) return;

    const cleanupToken = registerTokenGetter(() => getAccessTokenSilently());
    const cleanupRefresher = registerTokenRefresher(() =>
      getAccessTokenSilently({ cacheMode: "off" }),
    );
    const cleanupAuth = registerAuthErrorHandler(() => {
      logout({ logoutParams: { returnTo: `${window.location.origin}/explore` } });
    });

    return () => {
      cleanupToken();
      cleanupRefresher();
      cleanupAuth();
    };
  }, [isConfigured, isAuthenticated, getAccessTokenSilently, logout]);

  return { isLoading, isConfigured };
};
