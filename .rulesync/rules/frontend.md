---
root: false
globs:
  - 'src/**/*.ts'
  - 'src/**/*.tsx'
  - 'src/**/*.css'
---
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
