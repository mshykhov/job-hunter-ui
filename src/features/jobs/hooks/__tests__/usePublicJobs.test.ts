import { describe, expect,it } from "vitest";

import type { PublicJob } from "../../types";
import { mapPublicJobToTableRow } from "../usePublicJobs";

const basePublicJob: PublicJob = {
  id: "pub-1",
  title: "Senior Dev",
  company: "Acme Corp",
  url: "https://example.com/job/1",
  description: "<p>Test description</p>",
  source: "linkedin",
  salary: "$100k",
  location: "New York",
  remote: true,
  publishedAt: "2026-03-01T00:00:00Z",
  scrapedAt: "2026-03-02T00:00:00Z",
};

describe("mapPublicJobToTableRow", () => {
  it("maps all fields correctly to JobGroup shape", () => {
    const result = mapPublicJobToTableRow(basePublicJob);

    expect(result).toEqual({
      id: "pub-1",
      groupId: "pub-1",
      title: "Senior Dev",
      company: "Acme Corp",
      sources: ["linkedin"],
      salary: "$100k",
      locations: ["New York"],
      remote: true,
      status: "new",
      aiRelevanceScore: null,
      jobCount: 1,
      publishedAt: "2026-03-01T00:00:00Z",
      matchedAt: null,
      createdAt: null,
      updatedAt: "2026-03-02T00:00:00Z",
    });
  });

  it("sets id and groupId to same value", () => {
    const result = mapPublicJobToTableRow(basePublicJob);
    expect(result.id).toBe(result.groupId);
  });

  it("handles null location as empty locations array", () => {
    const job: PublicJob = { ...basePublicJob, location: null };
    const result = mapPublicJobToTableRow(job);
    expect(result.locations).toEqual([]);
  });

  it("handles null remote as false", () => {
    const job: PublicJob = { ...basePublicJob, remote: null };
    const result = mapPublicJobToTableRow(job);
    expect(result.remote).toBe(false);
  });

  it("handles null company", () => {
    const job: PublicJob = { ...basePublicJob, company: null };
    const result = mapPublicJobToTableRow(job);
    expect(result.company).toBeNull();
  });

  it("handles null salary", () => {
    const job: PublicJob = { ...basePublicJob, salary: null };
    const result = mapPublicJobToTableRow(job);
    expect(result.salary).toBeNull();
  });

  it("always sets jobCount to 1", () => {
    const result = mapPublicJobToTableRow(basePublicJob);
    expect(result.jobCount).toBe(1);
  });

  it("always sets status to new", () => {
    const result = mapPublicJobToTableRow(basePublicJob);
    expect(result.status).toBe("new");
  });
});
