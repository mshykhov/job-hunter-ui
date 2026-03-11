# Job Grouping API Changes

Jobs are now grouped by title/company. The UI works with **job groups** instead of individual jobs. Each group contains one or more job postings from different sources/locations.

---

## Data Model

```
JobGroup (title + company)
  └── JobEntity[] (individual postings: source, url, location, salary...)

UserJobGroup (per-user association)
  └── JobGroup (reference)
  └── status, aiRelevanceScore, aiReasoning
```

---

## Endpoints

### Search Job Groups

**`POST /jobs/search`** — `read:jobs`

Request:
```json
{
  "statuses": ["new", "applied"],
  "matchedAfter": "2026-01-01T00:00:00Z",
  "search": "kotlin",
  "remote": true,
  "minScore": 50,
  "page": 0,
  "size": 50,
  "sortBy": "SCORE"
}
```

All fields are optional. Defaults: `page=0`, `size=50`, `sortBy=SCORE`.

Response:
```json
{
  "content": [
    {
      "id": "uuid (user job group id)",
      "groupId": "uuid (job group id)",
      "title": "Senior Kotlin Developer",
      "company": "Acme Corp",
      "status": "new",
      "aiRelevanceScore": 85,
      "jobCount": 3,
      "sources": ["djinni", "dou", "linkedin"],
      "locations": ["Berlin", "Kyiv"],
      "salary": "5000 USD",
      "publishedAt": "2026-01-15T00:00:00Z",
      "matchedAt": "2026-01-20T12:00:00Z",
      "createdAt": "2026-01-15T00:00:00Z",
      "updatedAt": "2026-01-20T12:00:00Z"
    }
  ],
  "page": 0,
  "size": 50,
  "totalElements": 142,
  "totalPages": 3,
  "statusCounts": {
    "new": 120,
    "applied": 15,
    "irrelevant": 7
  }
}
```

Notes:
- `sources` — sorted alphabetically by value, deduplicated across all jobs in group
- `locations` — sorted alphabetically, nulls excluded, deduplicated
- `salary` — first non-null salary found in the group
- `publishedAt` — earliest publish date across all jobs in group
- `statusCounts` — totals across ALL groups (not just current page), useful for tab badges
- Max page size: 100

### Sort Options

| Value | Sort Order |
|-------|-----------|
| `SCORE` | aiRelevanceScore DESC, id DESC |
| `MATCHED` | matchedAt DESC, id DESC |

---

### Get Group Detail

**`GET /jobs/groups/{groupId}`** — `read:jobs`

Response:
```json
{
  "groupId": "uuid",
  "title": "Senior Kotlin Developer",
  "company": "Acme Corp",
  "status": "new",
  "aiRelevanceScore": 85,
  "aiReasoning": "Strong match for Kotlin/Spring Boot experience...",
  "jobs": [
    {
      "jobId": "uuid",
      "url": "https://djinni.co/jobs/123",
      "source": "djinni",
      "description": "Job description text...",
      "salary": "5000 USD",
      "location": "Kyiv",
      "remote": true,
      "coverLetter": "Generated cover letter text or null",
      "recruiterMessage": "Generated recruiter message or null",
      "publishedAt": "2026-01-15T00:00:00Z",
      "scrapedAt": "2026-01-16T10:00:00Z"
    }
  ]
}
```

Notes:
- `jobs` — all individual postings in this group
- `coverLetter` and `recruiterMessage` — null until user generates them via outreach endpoints
- Use `jobId` for outreach generation endpoints

---

### Update Group Status

**`PATCH /jobs/groups/{groupId}/status`** — `write:jobs`

Request:
```json
{
  "status": "applied"
}
```

Response: `UserJobGroupResponse` (same shape as search content items).

---

### Bulk Update Group Status

**`PATCH /jobs/groups/status`** — `write:jobs`

Request:
```json
{
  "groupIds": ["uuid1", "uuid2"],
  "status": "irrelevant"
}
```

Response: `List<UserJobGroupResponse>`.

---

### Generate Cover Letter

**`POST /jobs/{jobId}/outreach/cover-letter`** — `write:jobs`

Response:
```json
{
  "coverLetter": "Dear hiring manager...",
  "job": {
    "id": "uuid",
    "title": "Senior Kotlin Developer",
    "company": "Acme Corp",
    "url": "https://djinni.co/jobs/123",
    "source": "djinni"
  }
}
```

---

### Generate Recruiter Message

**`POST /jobs/{jobId}/outreach/recruiter-message`** — `write:jobs`

Response:
```json
{
  "recruiterMessage": "Hi, I saw your posting...",
  "job": {
    "id": "uuid",
    "title": "Senior Kotlin Developer",
    "company": "Acme Corp",
    "url": "https://djinni.co/jobs/123",
    "source": "djinni"
  }
}
```

---

### Rematch Jobs

**`POST /jobs/rematch`** — `write:jobs`

Query params: `since` (optional Instant) — only rematch jobs updated after this timestamp.

Response:
```json
{
  "jobsQueued": 42
}
```

---

## Enums

Both enums are available via public endpoints (no auth required).

### JobSource — `GET /public/jobs/sources`

Response:
```json
[
  { "id": "dou", "displayName": "DOU" },
  { "id": "djinni", "displayName": "Djinni" },
  { "id": "linkedin", "displayName": "Linkedin" },
  { "id": "euremotejobs", "displayName": "EuRemoteJobs" },
  { "id": "web3career", "displayName": "Web3.career" }
]
```

### UserJobStatus — `GET /public/jobs/statuses`

Response:
```json
[
  { "id": "new", "displayName": "New" },
  { "id": "applied", "displayName": "Applied" },
  { "id": "irrelevant", "displayName": "Irrelevant" }
]
```

---

## Key Changes from Previous API

1. **Groups replace individual jobs** — search returns `UserJobGroupResponse` instead of `UserJobResponse`
2. **`groupId` is the primary identifier** — use it for status updates and detail view
3. **`jobId` for outreach only** — cover letter and recruiter message generation use individual job IDs
4. **`aiInferredRemote` removed** — no longer returned in any response
5. **`sources` is `JobSource[]`** — array of enum values (lowercase strings), not plain strings
6. **`statusCounts` added** — search response includes group counts by status for all matching groups
7. **`jobCount` added** — each group shows how many individual postings it contains
8. **Aggregated fields** — `locations`, `sources`, `salary`, `publishedAt` are computed across all jobs in the group

---

## Error Responses

All errors follow the standard format:
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "User job group not found"
}
```

Common status codes:
- `400` — validation error (invalid request body)
- `404` — group/job not found for the authenticated user
- `503` — AI service unavailable (outreach generation)
