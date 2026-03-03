import { createContext, useContext } from "react";

export interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  user?: { email?: string; name?: string; picture?: string };
  loginWithRedirect: () => Promise<void>;
  logout: (options?: { logoutParams?: { returnTo?: string } }) => void;
  getAccessTokenSilently: () => Promise<string>;
}

export const noopAuth: AuthContextValue = {
  isAuthenticated: false,
  isLoading: false,
  isConfigured: false,
  loginWithRedirect: () => Promise.resolve(),
  logout: () => {},
  getAccessTokenSilently: () => Promise.reject(new Error("Auth0 not configured")),
};

export const AuthContext = createContext<AuthContextValue>(noopAuth);

export const useAuth = () => useContext(AuthContext);
