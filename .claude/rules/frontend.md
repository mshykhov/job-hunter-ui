---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "src/**/*.css"
---

# Frontend conventions

Enforceable checklist for `src/**`. Full rationale in `ui/CLAUDE.md`. Stack: React 19 +
TypeScript, Vite, Ant Design v6, TanStack Query, React Router v7, Auth0, Axios.

## Data & state
- Server state is TanStack Query ONLY - never `useState`+`useEffect` for API data.
- API calls live in hooks, never components. Use the `lib/api.ts` Axios instance (auth
  interceptor) - never `axios` directly. Reference paths via `API_PATHS.*` constants.
- Type every request/response. Hierarchical `queryKey`; invalidate only related keys.
  Hooks return an object (`{ data, isLoading, error }`), not a tuple.

## Components
- Functional only (ErrorBoundary is the sole class). Named exports only - `default`
  only for lazy pages. Props interface `{Name}Props` above the component, destructured.
- No business logic in components - extract a hook. One component per file.
- Never use array index as list `key` - use a stable data id.

## Styling
- Antd `ConfigProvider` tokens are the source of truth (`styles/theme.ts`, accent
  `#4F46E5`, radius `6`, dark-first). No hardcoded colors - use antd tokens or
  `--ant-color-*` runtime vars; score/status via `--ant-color-success|warning|error`.
- No inline styles for themable values - use CSS classes in `global.css`, feature-
  prefixed (`.jobs-*`, `.settings-*`). No `!important`, no CSS modules.

## Types, structure, imports
- No `any` (`unknown` then narrow). No magic strings/numbers. Enum-like objects `as
  const`, type via `(typeof OBJ)[keyof typeof OBJ]`.
- One domain per `features/{name}/` (`components/`, `hooks/`, `types.ts`,
  `constants.ts`). Feature types colocate; cross-feature in `types/`.
- Import via `@/` alias (no `../../../`). Order: react -> libs -> `@/` -> relative ->
  styles. Barrel `index.ts` only for `components/`.
- Size guides: component <=150 lines, hook <=100, types <=50, constants <=30.

## Errors & tests
- ErrorBoundary at root; TanStack owns API error/retry. No silent `catch`. User errors
  via antd `message`/`notification`.
- Vitest + RTL + MSW (`setupServer` from `msw/node`). Test logic/transforms/flows, not
  antd or Auth0 internals. Co-locate in `__tests__/`; add a regression test per bugfix.
- Mock the API in ONE place: `src/mocks/` handlers/fixtures back both tests and the
  `npm run dev:mock` local preview - do not hand-roll a separate mock server.

## Redesign
- Redesign as a parallel route + components for side-by-side compare; retire the old
  screen only after approval (see `design-system.md`).
