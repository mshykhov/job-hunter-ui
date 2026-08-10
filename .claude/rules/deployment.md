---
paths:
  - .github/workflows/**
  - Dockerfile
  - docker/**
  - package.json
  - package-lock.json
  - vite.config.ts
  - public/config.js
  - src/config/constants.ts
  - src/components/AppVersion.tsx
---
# Versioning and deployment

- `package.json` is the source version. CI builds override `APP_VERSION` from the
  semver tag, and `AppVersion` displays both UI and API versions.
- Runtime configuration has precedence over build-time configuration and defaults.
- Keep `API_URL`, `OIDC_ENABLED`, `OIDC_AUTHORITY`, and `OIDC_CLIENT_ID` available
  through the established runtime placeholder flow.
- The Docker image is a Node build stage followed by unprivileged nginx on port 8080.
- Keep `index.html` and runtime `config.js` uncached. Content-hashed static assets may
  use immutable caching.
- Release tags match `vX.Y.Z` or the documented semver prerelease form and trigger the
  release workflow, Docker publication, and generated release notes.
- Run lint, format check, tests, and build before changing release identity.
