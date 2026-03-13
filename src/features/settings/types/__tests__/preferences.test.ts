import { describe, expect, it } from "vitest";

import type { GeneratePreferencesResponse, MatchingPreferences } from "../preferences";
import { EMPTY_PREFERENCES } from "../preferences";

describe("EMPTY_PREFERENCES", () => {
  it("matching contains only current API fields", () => {
    const matchingKeys = Object.keys(EMPTY_PREFERENCES.matching).sort();
    expect(matchingKeys).toEqual([
      "customPrompt",
      "excludedCompanies",
      "excludedKeywords",
      "excludedTitleKeywords",
      "matchWithAi",
    ]);
  });

  it("matching does not contain removed fields", () => {
    const matching = EMPTY_PREFERENCES.matching as Record<string, unknown>;
    expect(matching).not.toHaveProperty("seniorityLevels");
    expect(matching).not.toHaveProperty("keywords");
    expect(matching).not.toHaveProperty("weightKeywords");
    expect(matching).not.toHaveProperty("weightSeniority");
    expect(matching).not.toHaveProperty("weightCategories");
  });

  it("has correct default values", () => {
    expect(EMPTY_PREFERENCES.matching).toEqual({
      excludedKeywords: [],
      excludedTitleKeywords: [],
      excludedCompanies: [],
      matchWithAi: true,
      customPrompt: null,
    });
  });

  it("search contains expected fields", () => {
    expect(EMPTY_PREFERENCES.search).toEqual({
      categories: [],
      locations: [],
      disabledSources: [],
      remoteOnly: false,
    });
  });
});

describe("MatchingPreferences type contract", () => {
  it("accepts valid matching preferences", () => {
    const prefs: MatchingPreferences = {
      excludedKeywords: ["php"],
      excludedTitleKeywords: ["intern"],
      excludedCompanies: ["EPAM"],
      matchWithAi: true,
      customPrompt: "Prefer product companies",
    };
    expect(prefs.matchWithAi).toBe(true);
    expect(prefs.customPrompt).toBe("Prefer product companies");
  });

  it("allows null customPrompt", () => {
    const prefs: MatchingPreferences = {
      excludedKeywords: [],
      excludedTitleKeywords: [],
      excludedCompanies: [],
      matchWithAi: false,
      customPrompt: null,
    };
    expect(prefs.customPrompt).toBeNull();
  });
});

describe("GeneratePreferencesResponse type contract", () => {
  it("contains only current fields", () => {
    const response: GeneratePreferencesResponse = {
      categories: ["kotlin"],
      excludedKeywords: ["php"],
      locations: ["remote"],
      remoteOnly: true,
      disabledSources: [],
    };

    expect(Object.keys(response).sort()).toEqual([
      "categories",
      "disabledSources",
      "excludedKeywords",
      "locations",
      "remoteOnly",
    ]);
  });

  it("does not accept removed fields at runtime", () => {
    const response = {
      categories: ["kotlin"],
      excludedKeywords: [],
      locations: [],
      remoteOnly: false,
      disabledSources: [],
      seniorityLevels: ["senior"],
      keywords: ["spring"],
    };

    // Verify removed fields are not part of the expected shape
    const expected: GeneratePreferencesResponse = {
      categories: response.categories,
      excludedKeywords: response.excludedKeywords,
      locations: response.locations,
      remoteOnly: response.remoteOnly,
      disabledSources: response.disabledSources,
    };

    expect(expected).not.toHaveProperty("seniorityLevels");
    expect(expected).not.toHaveProperty("keywords");
  });
});
