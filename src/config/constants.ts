const runtimeConfig = window.__CONFIG__ ?? {};

const getConfig = (key: string, defaultValue = ""): string => {
  const runtime = runtimeConfig[key as keyof typeof runtimeConfig];
  if (runtime && !runtime.startsWith("__")) return runtime;

  const buildTime = import.meta.env[key] as string | undefined;
  if (buildTime) return buildTime;

  return defaultValue;
};

export const API_URL = getConfig("API_URL", "http://localhost:8095");

export const OIDC_ENABLED = getConfig("OIDC_ENABLED", "true") === "true";

export const OIDC_CONFIG = {
  authority: getConfig("OIDC_AUTHORITY"),
  clientId: getConfig("OIDC_CLIENT_ID"),
} as const;

export const APP_VERSION = __APP_VERSION__;
