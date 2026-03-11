import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach,beforeAll, describe, expect, it } from "vitest";

import type { JobGroupFilters, PaginatedJobGroupsResponse } from "../../types";
import { fetchJobGroupsPage } from "../jobSearchApi";

const API_BASE = "http://localhost:8095";

const emptyResponse: PaginatedJobGroupsResponse = {
  content: [],
  page: 0,
  size: 50,
  totalElements: 0,
  totalPages: 0,
  statusCounts: {},
};

let lastRequestBody: Record<string, unknown> = {};

const server = setupServer(
  http.post(`${API_BASE}/jobs/search`, async ({ request }) => {
    lastRequestBody = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(emptyResponse);
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
  lastRequestBody = {};
});

describe("fetchJobGroupsPage — request body building", () => {
  it("sends minimal body with defaults for empty filters", async () => {
    await fetchJobGroupsPage({}, 0);

    expect(lastRequestBody).toEqual({
      page: 0,
      size: 50,
      sortBy: "SCORE",
    });
  });

  it("sends matchedAfter when provided", async () => {
    const filters: JobGroupFilters = {
      matchedAfter: "2026-03-01T00:00:00Z",
    };
    await fetchJobGroupsPage(filters, 0);

    expect(lastRequestBody.matchedAfter).toBe("2026-03-01T00:00:00Z");
  });

  it("includes all filter fields in request body", async () => {
    const filters: JobGroupFilters = {
      statuses: ["new", "applied"],
      search: "react",
      remote: true,
      minScore: 60,
      matchedAfter: "2026-03-01T00:00:00Z",
      sortBy: "MATCHED",
      size: 25,
    };
    await fetchJobGroupsPage(filters, 3);

    expect(lastRequestBody).toEqual({
      statuses: ["new", "applied"],
      search: "react",
      remote: true,
      minScore: 60,
      matchedAfter: "2026-03-01T00:00:00Z",
      sortBy: "MATCHED",
      page: 3,
      size: 25,
    });
  });

  it("omits falsy filter values from request body", async () => {
    const filters: JobGroupFilters = {
      statuses: [],
      search: "",
      remote: false,
    };
    await fetchJobGroupsPage(filters, 0);

    expect(lastRequestBody.statuses).toBeUndefined();
    expect(lastRequestBody.search).toBeUndefined();
    expect(lastRequestBody.remote).toBeUndefined();
  });

  it("does not send sources field (groups aggregate sources)", async () => {
    await fetchJobGroupsPage({}, 0);

    expect(lastRequestBody.sources).toBeUndefined();
  });
});
