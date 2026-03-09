import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { fetchJobsPage, fetchPublicJobsPage } from "../jobSearchApi";
import type { JobFilters, PaginatedJobsResponse, PublicJobPageResponse } from "../../types";

const API_BASE = "http://localhost:8095";

const emptyJobsResponse: PaginatedJobsResponse = {
  content: [],
  page: 0,
  size: 50,
  totalElements: 0,
  totalPages: 0,
  statusCounts: {},
};

const emptyPublicResponse: PublicJobPageResponse = {
  content: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
};

let lastRequestBody: Record<string, unknown> = {};
let lastRequestUrl = "";

const server = setupServer(
  http.post(`${API_BASE}/jobs/search`, async ({ request }) => {
    lastRequestBody = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(emptyJobsResponse);
  }),
  http.get(`${API_BASE}/public/jobs`, ({ request }) => {
    lastRequestUrl = request.url;
    return HttpResponse.json(emptyPublicResponse);
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
  lastRequestBody = {};
  lastRequestUrl = "";
});

describe("fetchJobsPage — request body building", () => {
  it("sends minimal body with defaults for empty filters", async () => {
    await fetchJobsPage({}, 0);

    expect(lastRequestBody).toEqual({
      page: 0,
      size: 50,
      sortBy: "SCORE",
    });
  });

  it("maps periodField=matched to matchedAfter param", async () => {
    const filters: JobFilters = {
      since: "2026-03-01T00:00:00Z",
      periodField: "matched",
    };
    await fetchJobsPage(filters, 0);

    expect(lastRequestBody.matchedAfter).toBe("2026-03-01T00:00:00Z");
    expect(lastRequestBody.publishedAfter).toBeUndefined();
    expect(lastRequestBody.updatedAfter).toBeUndefined();
  });

  it("maps periodField=published to publishedAfter param", async () => {
    const filters: JobFilters = {
      since: "2026-03-01T00:00:00Z",
      periodField: "published",
    };
    await fetchJobsPage(filters, 0);

    expect(lastRequestBody.publishedAfter).toBe("2026-03-01T00:00:00Z");
    expect(lastRequestBody.matchedAfter).toBeUndefined();
  });

  it("maps periodField=updated to updatedAfter param", async () => {
    const filters: JobFilters = {
      since: "2026-03-01T00:00:00Z",
      periodField: "updated",
    };
    await fetchJobsPage(filters, 0);

    expect(lastRequestBody.updatedAfter).toBe("2026-03-01T00:00:00Z");
  });

  it("defaults to matchedAfter when periodField is not set", async () => {
    const filters: JobFilters = { since: "2026-03-01T00:00:00Z" };
    await fetchJobsPage(filters, 0);

    expect(lastRequestBody.matchedAfter).toBe("2026-03-01T00:00:00Z");
  });

  it("includes all filter fields in request body", async () => {
    const filters: JobFilters = {
      sources: ["DOU", "DJINNI"],
      statuses: ["new", "applied"],
      search: "react",
      remote: true,
      minScore: 60,
      since: "2026-03-01T00:00:00Z",
      periodField: "matched",
      sortBy: "PUBLISHED",
      size: 25,
    };
    await fetchJobsPage(filters, 3);

    expect(lastRequestBody).toEqual({
      sources: ["DOU", "DJINNI"],
      statuses: ["new", "applied"],
      search: "react",
      remote: true,
      minScore: 60,
      matchedAfter: "2026-03-01T00:00:00Z",
      sortBy: "PUBLISHED",
      page: 3,
      size: 25,
    });
  });

  it("omits falsy filter values from request body", async () => {
    const filters: JobFilters = {
      sources: [],
      statuses: [],
      search: "",
      remote: false,
    };
    await fetchJobsPage(filters, 0);

    expect(lastRequestBody.sources).toBeUndefined();
    expect(lastRequestBody.statuses).toBeUndefined();
    expect(lastRequestBody.search).toBeUndefined();
    expect(lastRequestBody.remote).toBeUndefined();
  });
});

describe("fetchPublicJobsPage — query params building", () => {
  it("appends multiple sources as separate params", async () => {
    const filters: JobFilters = { sources: ["DOU", "ADZUNA"] };
    await fetchPublicJobsPage(filters, 0);

    const url = new URL(lastRequestUrl);
    expect(url.searchParams.getAll("sources")).toEqual(["DOU", "ADZUNA"]);
  });

  it("maps since to publishedAfter param", async () => {
    const filters: JobFilters = { since: "2026-03-01T00:00:00Z" };
    await fetchPublicJobsPage(filters, 0);

    const url = new URL(lastRequestUrl);
    expect(url.searchParams.get("publishedAfter")).toBe("2026-03-01T00:00:00Z");
  });

  it("uses PUBLISHED as default sort for public jobs", async () => {
    await fetchPublicJobsPage({}, 0);

    const url = new URL(lastRequestUrl);
    expect(url.searchParams.get("sortBy")).toBe("PUBLISHED");
  });
});
