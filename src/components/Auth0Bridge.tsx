import { useEffect, useState, type ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AuthContext } from "@/hooks/useAuth";

interface Auth0BridgeProps {
  children: ReactNode;
}

const EMPTY_PERMISSIONS: string[] = [];

const decodePermissions = (token: string): string[] => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Array.isArray(payload.permissions) ? payload.permissions : [];
  } catch {
    return [];
  }
};

export const Auth0Bridge = ({ children }: Auth0BridgeProps) => {
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout, getAccessTokenSilently } =
    useAuth0();
  const [permissions, setPermissions] = useState(EMPTY_PERMISSIONS);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    getAccessTokenSilently()
      .then((token) => {
        if (!cancelled) setPermissions(decodePermissions(token));
      })
      .catch((err: unknown) => {
        console.error("Failed to fetch permissions:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, getAccessTokenSilently]);

  const resolvedPermissions = isAuthenticated ? permissions : EMPTY_PERMISSIONS;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        isConfigured: true,
        permissions: resolvedPermissions,
        user,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
