import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { API_URL } from "@/config/constants";

import { fetchVacancyStatistics, vacancyStatisticsQueryKey } from "../useVacancyStatistics";

let body: unknown;
const server = setupServer(
  http.post(`${API_URL}/statistics/vacancies/query`, async ({ request }) => {
    body = await request.json();
    return HttpResponse.json({
      from: "1970-01-01T00:00:00.000Z",
      to: "2026-08-20T00:00:00.000Z",
      bucket: "MONTH",
      exactSince: null,
      sourceCoverageSince: null,
      points: [],
    });
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
  body = undefined;
});

describe("vacancy statistics API", () => {
  it("posts the query unchanged and scopes the query key", async () => {
    const query = {
      from: "1970-01-01T00:00:00.000Z",
      to: "2026-08-20T00:00:00.000Z",
      bucket: "MONTH" as const,
      sources: ["linkedin"],
    };
    await fetchVacancyStatistics(query);
    expect(body).toEqual(query);
    expect(vacancyStatisticsQueryKey(query)).toEqual(["statistics", "vacancies", query]);
  });
});
