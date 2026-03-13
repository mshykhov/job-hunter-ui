import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const API_BASE = "http://localhost:8095";

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

let api: typeof import("@/lib/api");

beforeEach(async () => {
  vi.resetModules();
  api = await import("@/lib/api");
});

describe("API_PATHS — preferences endpoints", () => {
  it("PREFERENCES_ABOUT_OPTIMIZE points to /preferences/about/optimize", () => {
    expect(api.API_PATHS.PREFERENCES_ABOUT_OPTIMIZE).toBe("/preferences/about/optimize");
  });

  it("PREFERENCES_MATCHING points to /preferences/matching", () => {
    expect(api.API_PATHS.PREFERENCES_MATCHING).toBe("/preferences/matching");
  });
});

describe("POST /preferences/about/optimize — API integration", () => {
  it("sends POST and returns optimized about text", async () => {
    let requestMethod = "";
    let requestUrl = "";

    server.use(
      http.post(`${API_BASE}/preferences/about/optimize`, ({ request }) => {
        requestMethod = request.method;
        requestUrl = new URL(request.url).pathname;
        return HttpResponse.json({ about: "Optimized profile text" });
      }),
    );

    const { data } = await api.api.post<{ about: string }>(
      api.API_PATHS.PREFERENCES_ABOUT_OPTIMIZE,
    );

    expect(requestMethod).toBe("POST");
    expect(requestUrl).toBe("/preferences/about/optimize");
    expect(data.about).toBe("Optimized profile text");
  });

  it("propagates server errors", async () => {
    server.use(
      http.post(`${API_BASE}/preferences/about/optimize`, () => {
        return new HttpResponse(
          JSON.stringify({ status: 503, error: "AI service unavailable" }),
          { status: 503 },
        );
      }),
    );

    await expect(
      api.api.post(api.API_PATHS.PREFERENCES_ABOUT_OPTIMIZE),
    ).rejects.toThrow();
  });
});

describe("PUT /preferences/matching — request shape", () => {
  it("sends matching preferences without removed fields", async () => {
    let capturedBody: Record<string, unknown> = {};

    server.use(
      http.put(`${API_BASE}/preferences/matching`, async ({ request }) => {
        capturedBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json(capturedBody);
      }),
    );

    const matching = {
      excludedKeywords: ["php"],
      excludedTitleKeywords: ["intern"],
      excludedCompanies: ["EPAM"],
      matchWithAi: true,
      customPrompt: "Prefer product companies",
    };

    await api.api.put(api.API_PATHS.PREFERENCES_MATCHING, matching);

    expect(capturedBody).toEqual(matching);
    expect(capturedBody).not.toHaveProperty("seniorityLevels");
    expect(capturedBody).not.toHaveProperty("keywords");
    expect(capturedBody).not.toHaveProperty("weightKeywords");
    expect(capturedBody).not.toHaveProperty("weightSeniority");
    expect(capturedBody).not.toHaveProperty("weightCategories");
  });

  it("sends null customPrompt when not set", async () => {
    let capturedBody: Record<string, unknown> = {};

    server.use(
      http.put(`${API_BASE}/preferences/matching`, async ({ request }) => {
        capturedBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json(capturedBody);
      }),
    );

    await api.api.put(api.API_PATHS.PREFERENCES_MATCHING, {
      excludedKeywords: [],
      excludedTitleKeywords: [],
      excludedCompanies: [],
      matchWithAi: false,
      customPrompt: null,
    });

    expect(capturedBody.customPrompt).toBeNull();
    expect(capturedBody.matchWithAi).toBe(false);
  });
});

describe("POST /preferences/generate — response shape", () => {
  it("returns response without removed fields", async () => {
    const generateResponse = {
      categories: ["kotlin", "java"],
      excludedKeywords: ["php"],
      locations: ["remote"],
      remoteOnly: true,
      disabledSources: ["dou"],
    };

    server.use(
      http.post(`${API_BASE}/preferences/generate`, () => {
        return HttpResponse.json(generateResponse);
      }),
    );

    const { data } = await api.api.post(api.API_PATHS.PREFERENCES_GENERATE);

    expect(data).toEqual(generateResponse);
    expect(data).not.toHaveProperty("seniorityLevels");
    expect(data).not.toHaveProperty("keywords");
  });
});
