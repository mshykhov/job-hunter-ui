# job-hunter-ui

**TL;DR:** React frontend for [Job Hunter](https://github.com/mshykhov/job-hunter). Dashboard for browsing, filtering, and managing job vacancies collected by scrapers.

> **Stack**: React 19, TypeScript, Vite, Ant Design, TanStack Query, Auth0

---

## Portfolio Project

**Public repository.** Everything must be clean and professional.

### Standards
- **English only** — README, commits, CLAUDE.md, code, comments
- **Meaningful commits** — conventional commits
- **No junk** — no TODO-hacks, commented-out code in master
- **No AI mentions** in commits
- **No Co-Authored-By** — never add Co-Authored-By or any trailer referencing Claude/AI

---

## Architecture

### What This App Does
- Displays job vacancies collected by n8n scrapers via the API
- Lets users filter, sort, and paginate jobs
- Allows one-click status changes (NEW → APPLIED / IRRELEVANT)
- Manages user preferences (sources, categories, keywords, remote-only)
- Links to original vacancy pages

### Data Flow
```
Kotlin API (REST)
     ↓ GET /jobs, PUT /jobs/{id}/status
React UI (this module)
     ↓ GET /criteria, GET/PUT /user/preferences
User's Browser
```

### Pages

| Page | Auth | Description |
|------|------|-------------|
| Jobs | Yes | Main dashboard — job table with filters, side panel, kanban toggle |
| Statistics | Yes | Charts — jobs over time, by source, status distribution |
| Settings | Yes | User preferences — criteria, notifications, account |
| Login | No | Auth0 redirect |

---

## Code Rules

### Project Structure
```
src/
├── app/                    # App shell — routing, providers, layout
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers.tsx
├── components/             # Shared reusable components ONLY
│   ├── Layout/
│   │   ├── Sidebar.tsx
│   │   └── AppLayout.tsx
│   ├── AppVersion.tsx
│   └── ErrorBoundary.tsx
├── features/               # Feature modules — one folder per domain
│   ├── jobs/
│   │   ├── components/     # JobTable, JobFilters, JobSidePanel, JobKanban
│   │   ├── hooks/          # useJobs, useJobStatus, useJobFilters
│   │   ├── types.ts        # Job, JobStatus, JobFilters interfaces
│   │   └── constants.ts    # Job-specific constants (status colors, etc.)
│   ├── statistics/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   └── settings/
│       ├── components/
│       ├── hooks/
│       └── types.ts
├── hooks/                  # Shared hooks (useAuth, useTheme)
├── lib/                    # Infrastructure — API client, auth config
│   ├── api.ts              # Axios instance with auth interceptor
│   └── queryClient.ts      # TanStack Query client config
├── config/
│   └── constants.ts        # Env vars, API_URL, Auth0 config
├── types/                  # Shared types (ApiError, Pagination)
│   └── index.ts
├── styles/                 # Global styles, theme tokens
│   ├── theme.ts            # Ant Design theme config (dark/light)
│   └── global.css
└── main.tsx                # Entry point
```

### File Size Limits
- **Component**: max ~150 lines. If bigger → extract hook or split
- **Hook**: max ~100 lines. If bigger → split into smaller hooks
- **Types file**: max ~50 lines. If bigger → split by domain
- **Constants file**: max ~30 lines
- **One component per file** — no exceptions

### Component Rules
- **Functional components only** — no class components (except ErrorBoundary)
- **Named exports** — no `export default` (except lazy-loaded pages)
- **Props interface** above component, named `{ComponentName}Props`
- **Destructure props** in function signature
- **No business logic in components** — extract to hooks
- **No inline styles** — use Ant Design theme tokens or CSS classes

### Hook Rules
- **One hook per concern** — `useJobs` for jobs list, `useJobStatus` for status mutations
- **TanStack Query for all server state** — no `useState` + `useEffect` for API data
- **Return object, not array** — `{ data, isLoading, error }` not `[data, loading, error]`
- **Collocate with feature** — `features/jobs/hooks/useJobs.ts`

### API Layer
- **API spec** available at `http://localhost:8095/api-docs` (Swagger/OpenAPI)
- **Single Axios instance** in `lib/api.ts` with auth interceptor
- **Never call axios directly in components or hooks** — use the instance
- **API paths as constants** — `API_PATHS.JOBS`, not `"/jobs"`
- **Response types** on every API call — no untyped responses

### Types & Constants
- **No `any`** — use `unknown` if type is truly unknown, then narrow
- **No magic strings/numbers** — extract to constants
- **Shared types** in `types/` — `ApiError`, `PaginatedResponse<T>`
- **Feature types** co-located — `features/jobs/types.ts`
- **Enums as const objects** — `as const` over `enum` (better tree-shaking)

### Styles & Theming
- **Ant Design ConfigProvider** for theming — dark/light via `theme.ts`
- **No CSS modules** — use Ant Design token system + minimal global CSS
- **CSS class names** prefixed by feature: `.jobs-table`, `.settings-form`
- **No `!important`** — fix specificity properly
- **Theme tokens** for colors — never hardcode colors in components

### Imports
- **Always use `@/` alias** — no relative `../../../`
- **Barrel exports** (`index.ts`) only for `components/` — not for features
- **Import order**: react → libs → `@/` internal → relative → styles

### No Duplication
- **3+ usages → extract** to shared component or hook
- **2 components share logic → extract hook**
- **Same API call in 2 places → single hook with TanStack Query** (automatic dedup)
- **Same constant in 2 files → move to shared constants**

### Error Handling
- **ErrorBoundary** at app root — catches render errors
- **TanStack Query** handles API errors — `error` state, retry logic
- **No silent catches** — `catch(e) {}` is forbidden
- **User-facing errors** via Ant Design `message` or `notification`

---

## Versioning & Caching

### Versioning
- **Semver** in package.json — source of truth
- **Docker build arg** `APP_VERSION` overrides at build time
- **CI/CD** extracts version from git tag, passes to Docker
- **`<AppVersion />`** component displays current version in UI

### Cache Busting
- **Vite content hashing** — all JS/CSS bundles get unique hash filenames
- **index.html** — always `no-cache` (nginx)
- **Static assets** — `immutable` cache (filenames change on content change)
- **Service Worker** — auto-update strategy, periodic checks
- **Runtime config** (`config.js`) — always `no-cache`

---

## Deployment

### Docker
- **Multi-stage build** — Node (build) → nginx-unprivileged (serve)
- **Runtime config** via entrypoint script — env vars → `config.js`
- **Port 8080** (unprivileged nginx)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_URL` | Kotlin API base URL | Yes |
| `AUTH0_DOMAIN` | Auth0 tenant domain | Yes |
| `AUTH0_CLIENT_ID` | Auth0 SPA client ID | Yes |
| `AUTH0_AUDIENCE` | Auth0 API audience | Yes |
| `APP_VERSION` | Build version (injected by CI) | No |

### Config Priority
```
Runtime (window.__CONFIG__) > Build-time (import.meta.env) > Default
```

---

## Local Development

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint          # ESLint (0 warnings allowed)
npm run format:check  # Prettier
npm run test          # Vitest (unit + integration)
npm run build         # TypeScript type-check + build
```

## Testing

### Stack
- **Vitest** — test runner (native Vite integration, ESM support)
- **React Testing Library** — component rendering and interaction
- **MSW** — HTTP request mocking at network level
- **jsdom** — DOM environment for tests

### What to Test
- **Infrastructure logic** — API interceptors (auth retry, error handling), storage persistence
- **Data transformations** — filter serialization, request body building, response mapping
- **Custom hooks with business logic** — filter state management, query hooks
- **Critical user flows** — status changes, filter interactions

### What NOT to Test
- Ant Design components (already tested by the library)
- Auth0 SDK internals (external dependency)
- Pure routing/navigation
- Presentation-only components without logic

### Conventions
- **Co-locate tests** with source: `src/lib/__tests__/api.test.ts`, `features/jobs/hooks/__tests__/jobSearchApi.test.ts`
- **Test real behavior** — focus on bug prevention, not coverage metrics
- **Use MSW** for API mocking — intercept at network level, not axios mocks
- **Reset state** between tests — `vi.resetModules()` for module-level state
- **One describe per module/concern** — group related tests with nested describe blocks
- **Test names describe behavior** — `"preserves explicitly cleared values through round-trip"`, not `"test save method"`

### Patterns & Recipes

#### MSW server setup (every test file with API calls)
```typescript
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node"; // ALWAYS from "msw/node", NOT "msw"

const API_BASE = "http://localhost:8095";
const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
```

#### Module-level state isolation (api.ts interceptors, singletons)
```typescript
// When testing modules with module-level state (let refreshPromise, callbacks),
// use vi.resetModules() + dynamic import to get a fresh module per test
let api: typeof import("../api");

beforeEach(async () => {
  vi.resetModules();
  api = await import("../api");
  server.resetHandlers();
});
```

#### Capturing request details
```typescript
// For POST — capture body
let lastBody: Record<string, unknown> = {};
server.use(
  http.post(`${API_BASE}/endpoint`, async ({ request }) => {
    lastBody = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(responseData);
  }),
);

// For GET — capture URL/params
let lastUrl = "";
server.use(
  http.get(`${API_BASE}/endpoint`, ({ request }) => {
    lastUrl = request.url;
    return HttpResponse.json(responseData);
  }),
);
// Then parse: new URL(lastUrl).searchParams.get("key")

// For headers (auth tokens, etc.)
let capturedAuth = "";
server.use(
  http.get(`${API_BASE}/test`, ({ request }) => {
    capturedAuth = request.headers.get("authorization") ?? "";
    return HttpResponse.json({ ok: true });
  }),
);
```

#### Conditional responses (retry testing)
```typescript
let callCount = 0;
server.use(
  http.get(`${API_BASE}/data`, () => {
    callCount++;
    if (callCount === 1) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json({ result: "ok" });
  }),
);
```

#### localStorage-dependent tests
```typescript
beforeEach(() => localStorage.clear());
// No MSW needed — test storage directly
```

### What to Assert
- **Request shape** — correct params, body structure, headers sent to API
- **State transitions** — retry logic, error handler invocation, cleanup callbacks
- **Edge cases** — empty arrays omitted, undefined → null conversion, concurrent dedup
- **Regression guards** — add a test whenever you fix a bug to prevent recurrence

### Running Tests
```bash
npm run test          # Single run (CI)
npm run test:watch    # Watch mode (development)
```

## CI/CD

- **Trigger**: git tag `v*.*.*`
- **Pipeline**: lint → test → build → Docker image → push to registry
- **Tags**: `:{version}`, `:{major}` (e.g., `:1.0.0`, `:1`)
