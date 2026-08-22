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
  it("queues the complete package from the primary action", async () => {
    const requestBodies: unknown[] = [];
    let requests: unknown[] = [];
    server.use(
      http.get(`${API}/materials/profiles`, () =>
        HttpResponse.json([{ id: "profile-id", active: true }])
      ),
      http.get(`${API}/jobs/:jobId/materials`, () => HttpResponse.json(requests)),
      http.get(`${API}/jobs/:jobId/materials/revisions`, () => HttpResponse.json([])),
      http.post(`${API}/jobs/:jobId/materials`, async ({ request }) => {
        requestBodies.push(await request.json());
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

    await user.click(await screen.findByRole("button", { name: "Generate all" }));

    expect(requestBodies).toEqual([
      {
        regenerate: false,
        requestedKinds: ["CV_DOCX", "CV_PDF", "COVER_LETTER", "RECRUITER_MESSAGE"],
      },
    ]);
    expect(await screen.findByText("Queued")).toBeInTheDocument();
  });

  it("queues each artifact independently", async () => {
    const requestBodies: unknown[] = [];
    server.use(
      http.get(`${API}/materials/profiles`, () =>
        HttpResponse.json([{ id: "profile-id", active: true }])
      ),
      http.get(`${API}/jobs/:jobId/materials`, () => HttpResponse.json([])),
      http.get(`${API}/jobs/:jobId/materials/revisions`, () => HttpResponse.json([])),
      http.post(`${API}/jobs/:jobId/materials`, async ({ request }) => {
        requestBodies.push(await request.json());
        return HttpResponse.json({ status: "QUEUED" });
      })
    );
    const user = userEvent.setup();
    renderSection();

    await user.click(await screen.findByRole("button", { name: "Generate CV" }));
    await user.click(screen.getByRole("button", { name: "Generate cover letter" }));
    await user.click(screen.getByRole("button", { name: "Generate recruiter message" }));

    expect(requestBodies).toEqual([
      { regenerate: false, requestedKinds: ["CV_DOCX", "CV_PDF"] },
      { regenerate: false, requestedKinds: ["COVER_LETTER"] },
      { regenerate: false, requestedKinds: ["RECRUITER_MESSAGE"] },
    ]);
  });

  it("explains why generation is unavailable when the profile is missing", async () => {
    server.use(
      http.get(`${API}/materials/profiles`, () => HttpResponse.json([])),
      http.get(`${API}/jobs/:jobId/materials`, () => HttpResponse.json([])),
      http.get(`${API}/jobs/:jobId/materials/revisions`, () => HttpResponse.json([]))
    );
    renderSection();

    expect(await screen.findByText(/Candidate profile is not initialized/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate all" })).toBeDisabled();
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
