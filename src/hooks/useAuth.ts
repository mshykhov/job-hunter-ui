import { createContext, useContext } from "react";

export const PERMISSIONS = {
  READ_JOBS: "read:jobs",
  WRITE_JOBS: "write:jobs",
  READ_PREFERENCES: "read:preferences",
  WRITE_PREFERENCES: "write:preferences",
} as const;

export interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  permissions: string[];
  user?: { email?: string; name?: string; picture?: string };
  loginWithRedirect: () => Promise<void>;
  logout: (options?: { logoutParams?: { returnTo?: string } }) => void;
  getAccessTokenSilently: () => Promise<string>;
}

export const noopAuth: AuthContextValue = {
  isAuthenticated: false,
  isLoading: false,
  isConfigured: false,
  permissions: [],
  loginWithRedirect: () => Promise.resolve(),
  logout: () => {},
  getAccessTokenSilently: () => Promise.reject(new Error("Auth0 not configured")),
};

export const AuthContext = createContext<AuthContextValue>(noopAuth);

export const useAuth = () => useContext(AuthContext);
