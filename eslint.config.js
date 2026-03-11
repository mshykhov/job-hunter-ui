import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier,
    ],
    plugins: {
      react,
      "simple-import-sort": simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      // TypeScript strictness
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "error",

      // Import ordering: react → libs → @/ internal → relative
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react"],
            ["^[a-z@]"],
            ["^@/"],
            ["^\\."],
          ],
        },
      ],
      "simple-import-sort/exports": "error",

      // No default exports (except lazy-loaded pages)
      "no-restricted-exports": [
        "error",
        { restrictDefaultExports: { direct: true, named: true, defaultFrom: true } },
      ],

      // Flag dangerouslySetInnerHTML — must be reviewed for XSS
      "react/no-danger": "warn",

      // File size limits (soft enforcement)
      "max-lines": ["warn", { max: 160, skipBlankLines: true, skipComments: true }],
    },
  },
  // Stricter limits for types and constants files
  {
    files: ["**/types.ts", "**/types.tsx"],
    rules: {
      "max-lines": ["warn", { max: 60, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ["**/constants.ts"],
    rules: {
      "max-lines": ["warn", { max: 40, skipBlankLines: true, skipComments: true }],
    },
  },
  // Allow default exports for lazy-loaded pages and config files
  {
    files: ["**/pages/**/*.tsx", "**/app/**/*.tsx", "*.config.ts", "*.config.js"],
    rules: {
      "no-restricted-exports": "off",
    },
  },
  // Allow dangerouslySetInnerHTML in files that use sanitize
  {
    files: ["**/tests/**", "**/__tests__/**", "**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "max-lines": "off",
    },
  },
]);
