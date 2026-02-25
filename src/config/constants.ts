const runtimeConfig = window.__CONFIG__ ?? {};

const getConfig = (key: string, defaultValue = ""): string => {
  const runtime = runtimeConfig[key as keyof typeof runtimeConfig];
  if (runtime && !runtime.startsWith("__")) return runtime;

  const buildTime = import.meta.env[key] as string | undefined;
  if (buildTime) return buildTime;

  return defaultValue;
};

export const API_URL = getConfig("API_URL", "http://localhost:8095");

export const AUTH0_ENABLED = getConfig("AUTH0_ENABLED", "true") === "true";

export const AUTH0_CONFIG = {
  domain: getConfig("AUTH0_DOMAIN"),
  clientId: getConfig("AUTH0_CLIENT_ID"),
  audience: getConfig("AUTH0_AUDIENCE"),
} as const;

export const APP_VERSION = __APP_VERSION__;
