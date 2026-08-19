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

# Design system

- `design-system/` is the durable source of truth for tokens and component previews.
- `tokens.css` mirrors `src/styles/theme.ts`; update both in the same change.
- The interface is dark-first with accent `#4F46E5` and radius `6` unless an approved
  redesign changes the token contract.
- Build redesigns as a parallel route and component tree for side-by-side review.
- Retire the current screen only after its replacement is approved.

# Frontend conventions

## Data and state

- TanStack Query owns server state. Do not copy API data into `useState` plus
  `useEffect`.
- API calls live in hooks and use the `lib/api.ts` Axios instance with its auth
  interceptor. Components and hooks do not create direct Axios clients.
- Reference endpoints through `API_PATHS`, type every request and response, use
  hierarchical query keys, and invalidate only related keys.
- Check endpoint schemas and enums against the local OpenAPI spec at
  `http://localhost:8095/api-docs`.
- Hooks return named objects such as `{ data, isLoading, error }`, not tuples.

## Components and structure

- Use function components. `ErrorBoundary` is the only class component.
- Prefer named exports; default exports are reserved for lazy-loaded pages.
- Define `{Name}Props` above the component and destructure props in the signature.
- Keep business logic in hooks and one component per file.
- Use stable domain IDs for list keys, never array indexes.
- Keep one domain under `features/{name}/` with colocated components, hooks, types,
  constants, and tests. Cross-feature types belong in `types/`.
- Extract shared behavior when multiple components or API consumers need it.
- Size guides: component 150 lines, hook 100, types file 50, constants file 30.

## TypeScript and imports

- Use `unknown` and narrow it instead of using `any`.
- Model enum-like values as `as const` objects and derive their union types.
- Avoid magic strings and numbers.
- Import through `@/` instead of deep relative paths.
- Order imports as React, external libraries, `@/`, relative modules, then styles.
- Use barrel files only for component exports.

## Styling and errors

- Ant Design theme tokens in `styles/theme.ts` are the source of truth.
- Use tokens or `--ant-color-*` variables instead of hardcoded component colors.
- Use feature-prefixed classes in `global.css`; avoid CSS modules, theme-related inline
  styles, and `!important`.
- Keep the root error boundary and let TanStack Query own request retry and error
  state. Do not swallow exceptions.
- Show user-facing failures through established Ant Design messages or notifications.

# Frontend tests

- Use Vitest, React Testing Library, and MSW. Import `setupServer` from `msw/node`.
- Test behavior that prevents regressions: request shape, transformations, state
  transitions, critical user flows, retries, cleanup, and edge cases.
- Do not test Ant Design, OIDC library internals, pure navigation, or presentation-only
  components.
- Reuse `src/mocks/` handlers and fixtures for tests and `dev:mock`; do not create a
  second mock server.
- Co-locate tests under `__tests__/` and name them by observable behavior.
- Reset handlers after each test. Use `vi.resetModules()` plus dynamic imports when a
  module owns mutable singleton state.
- Capture request URL, JSON body, and headers in MSW handlers and assert the contract
  rather than implementation details.
- Clear versioned local storage between storage-dependent tests.
- Add a regression test for every bug fix.
