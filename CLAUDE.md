# Job Hunter UI

React dashboard for exploring, filtering, and managing vacancies collected by the
Job Hunter services.

Stack: React 19, TypeScript, Vite, Ant Design 6, TanStack Query, Axios, React Router
7, and standards-based OIDC with Authentik.

## Working contract

- Keep this public portfolio repository production-ready and its content in English.
- Use Conventional Commits without AI-generation references or attribution trailers.
- Avoid temporary workarounds, commented-out code, and unresolved TODO hacks on
  `master`.
- Preserve API, OIDC, and runtime configuration contracts across UI and backend
  changes.
- Use the `release-ui` skill for every versioned release.

## Product flow

- `/explore` is the public vacancy browser.
- `/jobs` is the authenticated dashboard with filters and review mode.
- `/settings` manages job preferences, provider configuration, outreach, and Telegram.
- `/automation` shows sanitized runner health only to the configured owner with
  `read:automation`.
- The root route selects `/jobs` when authentication is disabled or already complete;
  otherwise it selects `/explore`.
- Sign-in is an OIDC redirect from the application shell, not a separate login page.

The UI reads jobs, criteria, and owner-only automation health from the Kotlin REST
API, writes user preferences and job status changes, and displays the API and UI
versions in the application shell.

## Structure

- `src/app/` owns routing and providers.
- `src/components/` contains truly shared components.
- `src/features/` groups the automation, explore, jobs, and settings domains.
- `src/hooks/` contains shared hooks.
- `src/lib/` owns the API client, query client, storage, and infrastructure helpers.
- `src/config/` resolves runtime and build-time configuration.
- `src/styles/` owns theme tokens and global styles.

## Commands

```sh
npm ci
npm run dev
npm run dev:mock
npm run lint
npm run format:check
npm run test
npm run build
npm run rulesync:verify
```

The mock preview uses the same handlers and fixtures as tests and requires no backend
or identity provider.

## Agent configuration

`.rulesync/` is canonical. Generated instruction, scoped-rule, and skill files are
derived outputs and must not be edited directly.
