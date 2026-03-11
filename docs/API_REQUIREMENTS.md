# API Requirements for Settings Redesign

## New Endpoint: CV-based Normalization

### `POST /preferences/normalize/file`

Accepts a CV file and extracts structured job preferences using AI.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (binary) — PDF or DOCX, max 10MB

**Response:** `200 OK`
```json
{
  "rawInput": null,
  "categories": ["kotlin", "java"],
  "seniorityLevels": ["senior"],
  "keywords": ["spring boot", "microservices"],
  "excludedKeywords": ["php"],
  "locations": ["remote", "Ukraine"],
  "languages": ["english", "ukrainian"],
  "remoteOnly": false,
  "disabledSources": [],
  "minScore": 50,
  "notificationsEnabled": true
}
```

Same response schema as `POST /preferences/normalize` (returns full `PreferenceResponse`).

**Error responses:**
- `400` — unsupported file format or empty file
- `413` — file too large (>10MB)
- `422` — AI could not extract preferences from the file

---

## AI Providers & Models

### `GET /settings/ai-providers`

Returns available AI providers with their supported models. No authentication required (static config).

**Response:** `200 OK`
```json
[
  {
    "id": "openai",
    "name": "OpenAI",
    "models": [
      { "id": "gpt-4o", "name": "GPT-4o" },
      { "id": "gpt-4o-mini", "name": "GPT-4o Mini" },
      { "id": "gpt-4-turbo", "name": "GPT-4 Turbo" },
      { "id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo" }
    ]
  }
]
```

**Notes:**
- Initially returns only OpenAI; structure supports adding more providers later
- Provider list is defined on backend (config or hardcoded), not fetched from external APIs
- UI uses this to populate cascading Select dropdowns (provider → model)

---

## AI Configuration (per user)

### `GET /settings/ai-config`

Returns current AI configuration for the authenticated user.

**Response:** `200 OK`
```json
{
  "provider": "openai",
  "model": "gpt-4o-mini",
  "apiKey": "sk-...xxxx"
}
```

**Notes:**
- `apiKey` is masked in response (show only last 4 chars)
- Returns `null` fields if not configured

### `PUT /settings/ai-config`

Saves AI configuration.

**Request:**
```json
{
  "provider": "openai",
  "model": "gpt-4o-mini",
  "apiKey": "sk-proj-abc123..."
}
```

**Validation:**
- `provider` must be one of the known provider IDs from `GET /settings/ai-providers`
- `model` must be a valid model ID for the selected provider
- `apiKey` is optional (can be null to clear)

**Note:** API key should be encrypted at rest (e.g., using Jasypt or Spring Vault).
