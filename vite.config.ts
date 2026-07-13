import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(env.APP_VERSION || process.env.npm_package_version || "dev"),
      "import.meta.env.API_URL": JSON.stringify(env.API_URL),
      "import.meta.env.OIDC_ENABLED": JSON.stringify(env.OIDC_ENABLED),
      "import.meta.env.OIDC_AUTHORITY": JSON.stringify(env.OIDC_AUTHORITY),
      "import.meta.env.OIDC_CLIENT_ID": JSON.stringify(env.OIDC_CLIENT_ID),
    },
  };
});
