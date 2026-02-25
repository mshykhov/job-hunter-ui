/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface Window {
  __CONFIG__: {
    API_URL: string;
    AUTH0_DOMAIN: string;
    AUTH0_CLIENT_ID: string;
    AUTH0_AUDIENCE: string;
  };
}
