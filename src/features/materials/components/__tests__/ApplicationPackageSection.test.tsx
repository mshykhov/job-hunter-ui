import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import type { GroupJob } from "@/features/jobs/types";
import { ApplicationPackageSection } from "@/features/materials/components/ApplicationPackageSection";

const API = "http://localhost:8095";
const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ApplicationPackageSection", () => {
  it("queues the complete default package instead of separate AI messages", async () => {
    let requestBody: unknown;
    let requests: unknown[] = [];
    server.use(
      http.get(`${API}/jobs/:jobId/materials`, () => HttpResponse.json(requests)),
      http.get(`${API}/jobs/:jobId/materials/revisions`, () => HttpResponse.json([])),
      http.post(`${API}/jobs/:jobId/materials`, async ({ request }) => {
        requestBody = await request.json();
        const queued = {
          packageId: "package-id",
          requestId: "request-id",
          status: "QUEUED",
          mode: "TERRA",
          requestedKinds: ["CV_DOCX", "CV_PDF", "COVER_LETTER", "RECRUITER_MESSAGE"],
          coverLetterPolicy: "OPTIONAL_STANDARD",
          createdAt: null,
          updatedAt: null,
        };
        requests = [queued];
        return HttpResponse.json(queued);
      })
    );
    const user = userEvent.setup();
    renderSection();

    await user.click(await screen.findByRole("button", { name: /Generate package/ }));

    expect(requestBody).toEqual({ regenerate: false });
    expect(await screen.findByText("Queued")).toBeInTheDocument();
    expect(screen.queryByText("Generate cover letter")).not.toBeInTheDocument();
  });
});

function renderSection(): void {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <ApplicationPackageSection job={JOB} />
    </QueryClientProvider>
  );
}

const JOB: GroupJob = {
  jobId: "job-id",
  url: "https://example.test/job",
  source: "EXAMPLE",
  description: "Kotlin backend role",
  salary: null,
  location: "Remote",
  remote: true,
  publishedAt: null,
  scrapedAt: null,
};
