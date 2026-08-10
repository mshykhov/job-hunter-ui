import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

const execArgv = process.allowedNodeEnvironmentFlags.has(
  "--no-experimental-webstorage",
)
  ? ["--no-experimental-webstorage"]
  : [];

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify("test"),
  },
  test: {
    environment: "jsdom",
    execArgv,
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    restoreMocks: true,
  },
});
