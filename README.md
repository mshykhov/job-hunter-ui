# job-hunter-ui

React frontend for [Job Hunter](https://github.com/mshykhov/job-hunter). Dashboard for browsing, filtering, and managing job vacancies collected by scrapers.

## Tech Stack

| Technology       | Purpose                   |
| ---------------- | ------------------------- |
| React 19         | UI framework              |
| TypeScript       | Type safety               |
| Vite             | Build tool                |
| Ant Design 6     | Component library         |
| TanStack Query   | Server state management   |
| Apache ECharts 6 | Vacancy history charts    |
| Authentik (OIDC) | Authentication (optional) |
| Axios            | HTTP client               |

## Architecture

```
User's Browser
     ↓ React UI (this module)
Kotlin API (jobs, preferences, owner-only automation status)
     ↓
PostgreSQL and automation runtime
```

### Pages

| Page       | Auth             | Description                                                     |
| ---------- | ---------------- | --------------------------------------------------------------- |
| Explore    | No               | Public vacancy browser                                          |
| Jobs       | Yes              | Dashboard with filters, detail panel, and review mode           |
| Statistics | `read:jobs`      | Vacancy history, matching outcomes, source filters, and AI score |
| Settings   | Yes              | Preferences, AI providers, outreach, and Telegram               |
| Automation | Owner scope only | Sanitized runner, browser, MCP, API, database, and Codex health |

### Project Structure

```
src/
├── app/              # App shell — routing, providers
├── components/       # Shared reusable components (Layout, AuthProvider)
├── features/         # Feature modules (automation, explore, jobs, settings, statistics)
├── hooks/            # Shared hooks (useAuth, useTheme)
├── lib/              # Infrastructure — API client, query client
├── config/           # Environment config, constants
├── types/            # Shared TypeScript types
└── styles/           # Theme config, global CSS
```

## Quick Start

```bash
cp .env.example .env.local    # fill in API_URL and optional OIDC config
npm ci
npm run dev                   # http://localhost:5173
```

### Environment Variables

| Variable         | Description                          | Required |
| ---------------- | ------------------------------------ | -------- |
| `API_URL`        | Kotlin API base URL                  | Yes      |
| `OIDC_AUTHORITY` | OIDC issuer URL (Authentik app slug) | No       |
| `OIDC_CLIENT_ID` | OIDC public client ID                | No       |
| `OIDC_ENABLED`   | Enable/disable auth (`true`/`false`) | No       |

When OIDC is not configured, the public Explore page remains accessible. Jobs,
Statistics, Settings, and Automation keep their production permission gates;
Automation also requires the owner-scoped `read:automation` token.

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

## Agent Configuration

`.rulesync/` is the canonical source for repository instructions, scoped rules, and
release skills. `CLAUDE.md`, `AGENTS.md`, `.claude/`, and `.agents/` contain generated
target projections and must not be edited directly.

```bash
npm ci
npm run rulesync:dry-run
npm run rulesync:generate
npm run rulesync:verify
```

## License

MIT
