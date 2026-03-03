import type { ReactNode } from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { AUTH0_CONFIG, AUTH0_ENABLED } from "@/config/constants";
import { AuthContext, noopAuth } from "@/hooks/useAuth";
import { Auth0Bridge } from "./Auth0Bridge";

interface AuthProviderProps {
  children: ReactNode;
}

const isAuth0Configured = AUTH0_ENABLED && !!AUTH0_CONFIG.domain && !!AUTH0_CONFIG.clientId;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  if (!isAuth0Configured) {
    return <AuthContext.Provider value={noopAuth}>{children}</AuthContext.Provider>;
  }

  return (
    <Auth0Provider
      domain={AUTH0_CONFIG.domain}
      clientId={AUTH0_CONFIG.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: AUTH0_CONFIG.audience || undefined,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <Auth0Bridge>{children}</Auth0Bridge>
    </Auth0Provider>
  );
};
