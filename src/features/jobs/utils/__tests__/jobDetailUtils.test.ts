import { describe, expect, it } from "vitest";

import type { GroupJob } from "../../types";
import { getScoreClass, getScoreLabel, sortJobsByDate } from "../jobDetailUtils";

const makeJob = (overrides: Partial<GroupJob> = {}): GroupJob => ({
  jobId: "job-1",
  url: "https://example.com",
  source: "dou",
  description: "",
  salary: null,
  location: null,
  remote: false,
  coverLetter: null,
  recruiterMessage: null,
  publishedAt: null,
  scrapedAt: null,
  ...overrides,
});

describe("getScoreClass", () => {
  describe("high score (>= 70)", () => {
    it("returns high class at boundary 70", () => {
      expect(getScoreClass(70)).toBe("job-detail-score--high");
    });

    it("returns high class for 100", () => {
      expect(getScoreClass(100)).toBe("job-detail-score--high");
    });
  });

  describe("medium score (>= 40 and < 70)", () => {
    it("returns medium class at boundary 40", () => {
      expect(getScoreClass(40)).toBe("job-detail-score--medium");
    });

    it("returns medium class at upper boundary 69", () => {
      expect(getScoreClass(69)).toBe("job-detail-score--medium");
    });
  });

  describe("low score (< 40)", () => {
    it("returns low class at boundary 39", () => {
      expect(getScoreClass(39)).toBe("job-detail-score--low");
    });

    it("returns low class for 0", () => {
      expect(getScoreClass(0)).toBe("job-detail-score--low");
    });
  });
});

describe("getScoreLabel", () => {
  it("returns 'high' for scores >= 70", () => {
    expect(getScoreLabel(70)).toBe("high");
    expect(getScoreLabel(100)).toBe("high");
  });

  it("returns 'medium' for scores >= 40 and < 70", () => {
    expect(getScoreLabel(40)).toBe("medium");
    expect(getScoreLabel(69)).toBe("medium");
  });

  it("returns 'low' for scores < 40", () => {
    expect(getScoreLabel(39)).toBe("low");
    expect(getScoreLabel(0)).toBe("low");
  });
});

describe("sortJobsByDate", () => {
  it("sorts by publishedAt descending (newest first)", () => {
    const jobs = [
      makeJob({ jobId: "old", publishedAt: "2026-01-01T00:00:00Z" }),
      makeJob({ jobId: "new", publishedAt: "2026-03-15T00:00:00Z" }),
      makeJob({ jobId: "mid", publishedAt: "2026-02-10T00:00:00Z" }),
    ];

    const sorted = sortJobsByDate(jobs);

    expect(sorted.map((j) => j.jobId)).toEqual(["new", "mid", "old"]);
  });

  it("falls back to scrapedAt when publishedAt is null", () => {
    const jobs = [
      makeJob({ jobId: "scraped-old", scrapedAt: "2026-01-01T00:00:00Z" }),
      makeJob({ jobId: "scraped-new", scrapedAt: "2026-03-01T00:00:00Z" }),
    ];

    const sorted = sortJobsByDate(jobs);

    expect(sorted.map((j) => j.jobId)).toEqual(["scraped-new", "scraped-old"]);
  });

  it("prefers publishedAt over scrapedAt when both exist", () => {
    const jobs = [
      makeJob({
        jobId: "published-old",
        publishedAt: "2026-01-01T00:00:00Z",
        scrapedAt: "2026-03-01T00:00:00Z",
      }),
      makeJob({
        jobId: "published-new",
        publishedAt: "2026-02-01T00:00:00Z",
        scrapedAt: "2026-01-01T00:00:00Z",
      }),
    ];

    const sorted = sortJobsByDate(jobs);

    expect(sorted.map((j) => j.jobId)).toEqual(["published-new", "published-old"]);
  });

  it("mixes publishedAt and scrapedAt fallback correctly", () => {
    const jobs = [
      makeJob({ jobId: "with-published", publishedAt: "2026-02-01T00:00:00Z" }),
      makeJob({ jobId: "with-scraped", scrapedAt: "2026-03-01T00:00:00Z" }),
    ];

    const sorted = sortJobsByDate(jobs);

    expect(sorted.map((j) => j.jobId)).toEqual(["with-scraped", "with-published"]);
  });

  it("handles jobs with neither date", () => {
    const jobs = [
      makeJob({ jobId: "no-date" }),
      makeJob({ jobId: "has-date", publishedAt: "2026-01-01T00:00:00Z" }),
    ];

    const sorted = sortJobsByDate(jobs);

    expect(sorted[0].jobId).toBe("has-date");
  });

  it("does not mutate the original array", () => {
    const jobs = [
      makeJob({ jobId: "b", publishedAt: "2026-01-01T00:00:00Z" }),
      makeJob({ jobId: "a", publishedAt: "2026-03-01T00:00:00Z" }),
    ];
    const originalOrder = [...jobs.map((j) => j.jobId)];

    sortJobsByDate(jobs);

    expect(jobs.map((j) => j.jobId)).toEqual(originalOrder);
  });

  it("returns empty array for empty input", () => {
    expect(sortJobsByDate([])).toEqual([]);
  });

  it("returns single-element array unchanged", () => {
    const jobs = [makeJob({ jobId: "only" })];
    const sorted = sortJobsByDate(jobs);

    expect(sorted).toHaveLength(1);
    expect(sorted[0].jobId).toBe("only");
  });
});
