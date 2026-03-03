# job-hunter-ui

React frontend for [Job Hunter](https://github.com/mshykhov/job-hunter). Dashboard for browsing, filtering, and managing job vacancies collected by scrapers.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Ant Design 6 | Component library |
| TanStack Query | Server state management |
| Auth0 | Authentication (optional) |
| Axios | HTTP client |

## Architecture

```
Kotlin API (REST)
     ↓ GET /jobs/search, PUT /jobs/{id}/status
React UI (this module)
     ↓ GET /criteria, GET/PUT /preferences
User's Browser
```

### Pages

| Page | Auth | Description |
|------|------|-------------|
| Landing | No | Welcome page with sign-in |
| Jobs | Yes | Main dashboard — job table with filters, side panel, review mode |
| Statistics | No | Status cards and analytics |
| Settings | Yes | User preferences — criteria, notifications |

### Project Structure

```
src/
├── app/              # App shell — routing, providers
├── components/       # Shared reusable components (Layout, AuthProvider)
├── features/         # Feature modules (jobs, statistics, settings, landing)
├── hooks/            # Shared hooks (useAuth, useTheme)
├── lib/              # Infrastructure — API client, query client
├── config/           # Environment config, constants
├── types/            # Shared TypeScript types
└── styles/           # Theme config, global CSS
```

## Quick Start

```bash
cp .env.example .env.local    # fill in API_URL, Auth0 config (optional)
npm install
npm run dev                   # http://localhost:5173
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_URL` | Kotlin API base URL | Yes |
| `AUTH0_DOMAIN` | Auth0 tenant domain | No |
| `AUTH0_CLIENT_ID` | Auth0 SPA client ID | No |
| `AUTH0_AUDIENCE` | Auth0 API audience | No |
| `AUTH0_ENABLED` | Enable/disable auth (`true`/`false`) | No |

When Auth0 is not configured, all pages are accessible without authentication.

## Scripts

```bash
npm run dev           # Start dev server
npm run build         # TypeScript check + production build
npm run lint          # ESLint (0 warnings)
npm run format:check  # Prettier check
```

## Docker

Multi-stage build: Node (build) → nginx-unprivileged (serve) on port 8080.

Runtime config is injected via entrypoint script (env vars → `config.js`).

```bash
docker build -t job-hunter-ui .
docker run -p 8080:8080 -e API_URL=http://api:8095 job-hunter-ui
```

## License

MIT
