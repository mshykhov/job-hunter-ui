import { http, HttpResponse } from "msw";

import { API_URL } from "@/config/constants";
import type { JobGroup, PaginatedJobGroupsResponse, UserJobStatus } from "@/features/jobs/types";

import { buildDetail, GROUPS, PUBLIC_JOBS, SOURCES } from "./fixtures";
import {
  AI_PROVIDER_CHAIN_MOCK,
  AI_PROVIDERS_MOCK,
  OUTREACH_MOCK,
  PREFERENCES_MOCK,
} from "./settingsFixtures";

const url = (path: string) => `${API_URL}${path}`;

interface SearchBody {
  statuses?: UserJobStatus[];
  sources?: string[];
  search?: string;
  remote?: boolean;
  matchedAfter?: string;
  minScore?: number;
  page?: number;
  size?: number;
  sortBy?: string;
}

const applyFilters = (list: JobGroup[], f: SearchBody): JobGroup[] => {
  let out = list;
  if (f.matchedAfter) out = out.filter((g) => !!g.matchedAt && g.matchedAt >= f.matchedAfter!);
  if (f.sources?.length) out = out.filter((g) => g.sources.some((s) => f.sources!.includes(s)));
  if (f.remote) out = out.filter((g) => g.remote);
  if (f.minScore != null) out = out.filter((g) => (g.aiRelevanceScore ?? -1) >= f.minScore!);
  if (f.search) {
    const q = f.search.toLowerCase();
    out = out.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        (g.company ?? "").toLowerCase().includes(q) ||
        g.locations.join(" ").toLowerCase().includes(q)
    );
  }
  return out;
};

const sortGroups = (list: JobGroup[], sortBy?: string): JobGroup[] => {
  const s = [...list];
  if (sortBy === "MATCHED") s.sort((a, b) => (b.matchedAt ?? "").localeCompare(a.matchedAt ?? ""));
  else s.sort((a, b) => (b.aiRelevanceScore ?? -1) - (a.aiRelevanceScore ?? -1));
  return s;
};

export const handlers = [
  http.post(url("/jobs/search"), async ({ request }) => {
    const f = (await request.json()) as SearchBody;
    const base = applyFilters(GROUPS, { ...f, statuses: undefined });
    const statusCounts = base.reduce<Partial<Record<UserJobStatus, number>>>((acc, g) => {
      acc[g.status] = (acc[g.status] ?? 0) + 1;
      return acc;
    }, {});
    let filtered = base;
    if (f.statuses?.length) filtered = filtered.filter((g) => f.statuses!.includes(g.status));
    filtered = sortGroups(filtered, f.sortBy);
    const size = f.size ?? 50;
    const page = f.page ?? 0;
    const content = filtered.slice(page * size, page * size + size);
    const response: PaginatedJobGroupsResponse = {
      content,
      page,
      size,
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / size)),
      statusCounts,
    };
    return HttpResponse.json(response);
  }),

  http.get(url("/jobs/groups/:groupId"), ({ params }) => {
    const g = GROUPS.find((x) => x.groupId === params.groupId);
    return g ? HttpResponse.json(buildDetail(g)) : new HttpResponse(null, { status: 404 });
  }),

  http.patch(url("/jobs/groups/:groupId/status"), async ({ params, request }) => {
    const g = GROUPS.find((x) => x.groupId === params.groupId);
    if (!g) return new HttpResponse(null, { status: 404 });
    const { status } = (await request.json()) as { status: UserJobStatus };
    g.status = status;
    g.updatedAt = new Date().toISOString();
    return HttpResponse.json(g);
  }),

  http.post(url("/jobs/rematch"), () => HttpResponse.json({ jobsQueued: 12 })),

  http.get(url("/public/jobs/sources"), () => HttpResponse.json(SOURCES)),

  http.get(url("/public/jobs"), ({ request }) => {
    const params = new URL(request.url).searchParams;
    const publishedAfter = params.get("publishedAfter");
    const search = params.get("search")?.toLowerCase();
    const remote = params.get("remote") === "true";
    const sources = params.getAll("sources");
    const sortBy = params.get("sortBy");

    let filtered = PUBLIC_JOBS.filter((j) => {
      if (publishedAfter && (!j.publishedAt || j.publishedAt < publishedAfter)) return false;
      if (remote && !j.remote) return false;
      if (sources.length && !sources.includes(j.source)) return false;
      if (
        search &&
        !`${j.title} ${j.company ?? ""} ${j.location ?? ""}`.toLowerCase().includes(search)
      )
        return false;
      return true;
    });
    const dateKey = sortBy === "SCRAPED" ? "scrapedAt" : "publishedAt";
    filtered = [...filtered].sort((a, b) => (b[dateKey] ?? "").localeCompare(a[dateKey] ?? ""));

    const size = Number(params.get("size") ?? 50);
    const page = Number(params.get("page") ?? 0);
    return HttpResponse.json({
      content: filtered.slice(page * size, page * size + size),
      page,
      size,
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / size)),
    });
  }),

  http.get(url("/public/version"), () => HttpResponse.json({ version: "dev-mock" })),
  http.get(url("/actuator/health"), () => HttpResponse.json({ status: "UP" })),

  http.get(url("/preferences"), () => HttpResponse.json(PREFERENCES_MOCK)),
  http.put(url("/preferences/search"), async ({ request }) =>
    HttpResponse.json(await request.json())
  ),
  http.put(url("/preferences/matching"), async ({ request }) =>
    HttpResponse.json(await request.json())
  ),
  http.put(url("/preferences/telegram"), async ({ request }) =>
    HttpResponse.json(await request.json())
  ),
  http.put(url("/preferences/about"), async ({ request }) =>
    HttpResponse.json(await request.json())
  ),

  http.get(url("/settings/outreach"), () => HttpResponse.json(OUTREACH_MOCK)),
  http.put(url("/settings/outreach"), async ({ request }) =>
    HttpResponse.json(await request.json())
  ),

  http.get(url("/settings/ai-providers"), () => HttpResponse.json(AI_PROVIDERS_MOCK)),
  http.get(url("/settings/ai/providers"), () => HttpResponse.json(AI_PROVIDER_CHAIN_MOCK)),
  http.put(url("/settings/ai/providers"), async ({ request }) => {
    const body = (await request.json()) as {
      chain: {
        priority: number;
        provider: string;
        modelId: string;
        apiKey?: string;
        enabled: boolean;
      }[];
    };
    const storedHints = new Map(
      AI_PROVIDER_CHAIN_MOCK.chain.map((e) => [e.provider, e.apiKeyHint])
    );
    AI_PROVIDER_CHAIN_MOCK.chain = body.chain.map((entry) => ({
      priority: entry.priority,
      provider: entry.provider,
      modelId: entry.modelId,
      apiKeyHint: entry.apiKey?.trim()
        ? "sk-...saved"
        : (storedHints.get(entry.provider) ?? "No API key required"),
      enabled: entry.enabled,
    }));
    return HttpResponse.json(AI_PROVIDER_CHAIN_MOCK);
  }),
];
