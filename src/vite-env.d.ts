/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface Window {
  __CONFIG__: {
    API_URL: string;
    OIDC_ENABLED: string;
    OIDC_AUTHORITY: string;
    OIDC_CLIENT_ID: string;
  };
}
