import type { ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AuthContext } from "@/hooks/useAuth";

interface Auth0BridgeProps {
  children: ReactNode;
}

export const Auth0Bridge = ({ children }: Auth0BridgeProps) => {
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout, getAccessTokenSilently } =
    useAuth0();

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        isConfigured: true,
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
