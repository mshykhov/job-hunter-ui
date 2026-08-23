import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { JobGroupJobs } from "@/features/jobs/components/JobGroupJobs";
import type { GroupJob } from "@/features/jobs/types";

vi.mock("@/features/materials/components/ApplicationPackageSection", () => ({
  ApplicationPackageSection: () => null,
}));

vi.mock("@/features/jobs/hooks/useSourceNames", () => ({
  useSourceNames: () => ({ EXAMPLE: "Example" }),
}));

describe("JobGroupJobs", () => {
  it("keeps a single vacancy description in the parent review scroller", () => {
    const { container } = render(<JobGroupJobs jobs={[JOB]} />);
    const description = container.querySelector<HTMLElement>(".job-description");

    expect(description).not.toBeNull();
    expect(description?.style.maxHeight).toBe("");
    expect(description?.style.overflow).toBe("");
  });
});

const JOB: GroupJob = {
  jobId: "job-id",
  url: "https://example.test/job",
  source: "EXAMPLE",
  description: "A long vacancy description",
  salary: null,
  location: "Remote",
  remote: true,
  publishedAt: null,
  scrapedAt: null,
};
