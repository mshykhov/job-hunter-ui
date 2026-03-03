import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

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
      __APP_VERSION__: JSON.stringify(
        env.APP_VERSION || process.env.npm_package_version || "dev"
      ),
      "import.meta.env.API_URL": JSON.stringify(env.API_URL),
      "import.meta.env.AUTH0_ENABLED": JSON.stringify(env.AUTH0_ENABLED),
      "import.meta.env.AUTH0_DOMAIN": JSON.stringify(env.AUTH0_DOMAIN),
      "import.meta.env.AUTH0_CLIENT_ID": JSON.stringify(env.AUTH0_CLIENT_ID),
      "import.meta.env.AUTH0_AUDIENCE": JSON.stringify(env.AUTH0_AUDIENCE),
    },
  };
});
