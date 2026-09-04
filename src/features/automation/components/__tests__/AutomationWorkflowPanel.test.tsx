import { type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AutomationWorkflowPanel } from "@/features/automation/components/AutomationWorkflowPanel";
import type { WorkflowRun } from "@/features/automation/workflowTypes";
import { AuthContext, type AuthContextValue, PERMISSIONS } from "@/hooks/useAuth";

const RUNS_URL = "http://localhost:8095/automation/workflows/runs";
const RUN_URL = `${RUNS_URL}/${"d07cb2ae-3b18-46d4-8c2d-aeaaf3bbce1f"}`;
const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("AutomationWorkflowPanel", () => {
  it("renders durable progress attempts checkpoints and history", async () => {
    useRunHandlers();

    renderPanel(auth([PERMISSIONS.READ_AUTOMATION, PERMISSIONS.WRITE_AUTOMATION]));

    expect(await screen.findByText("Run details")).toBeInTheDocument();
    expect(screen.getByText("1/3")).toBeInTheDocument();
    expect(screen.getByText("Attempts (1)")).toBeInTheDocument();
    expect(screen.getByText("Checkpoints (1)")).toBeInTheDocument();
    expect(screen.getByText(/RUN_CREATED/)).toBeInTheDocument();
  });

  it("sends a UUID idempotency key and an owner pause command", async () => {
    const bodies: unknown[] = [];
    let pauseCalls = 0;
    useRunHandlers();
    server.use(
      http.post(RUNS_URL, async ({ request }) => {
        bodies.push(await request.json());
        return HttpResponse.json(run);
      }),
      http.post(`${RUN_URL}/pause`, () => {
        pauseCalls += 1;
        return HttpResponse.json({ ...run, status: "PAUSED" });
      })
    );
    const user = userEvent.setup();
    renderPanel(auth([PERMISSIONS.READ_AUTOMATION, PERMISSIONS.WRITE_AUTOMATION]));

    await user.click(await screen.findByRole("button", { name: "Start recovery drill" }));
    await vi.waitFor(() => expect(bodies).toHaveLength(1));
    const body = bodies[0] as { idempotencyKey: string };
    expect(body.idempotencyKey).toMatch(/^[0-9a-f-]{36}$/);
    await user.click(screen.getByRole("button", { name: "Pause" }));
    await vi.waitFor(() => expect(pauseCalls).toBe(1));
  });

  it("keeps controls disabled with read-only automation permission", async () => {
    useRunHandlers();

    renderPanel(auth([PERMISSIONS.READ_AUTOMATION]));

    expect(await screen.findByText("Read-only access")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start recovery drill" })).toBeDisabled();
    expect(await screen.findByRole("button", { name: "Pause" })).toBeDisabled();
  });
});

function useRunHandlers(): void {
  server.use(
    http.get(RUNS_URL, () => HttpResponse.json([run])),
    http.get(RUN_URL, () => HttpResponse.json(run))
  );
}

function renderPanel(value: AuthContextValue): void {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <Providers queryClient={queryClient} auth={value}>
      <AutomationWorkflowPanel />
    </Providers>
  );
}

function Providers({
  children,
  queryClient,
  auth,
}: {
  children: ReactNode;
  queryClient: QueryClient;
  auth: AuthContextValue;
}) {
  return (
    <AuthContext.Provider value={auth}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthContext.Provider>
  );
}

function auth(permissions: string[]): AuthContextValue {
  return {
    isAuthenticated: true,
    isLoading: false,
    isConfigured: true,
    permissions,
    loginWithRedirect: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    getAccessTokenSilently: () => Promise.resolve("token"),
  };
}

const run: WorkflowRun = {
  id: "d07cb2ae-3b18-46d4-8c2d-aeaaf3bbce1f",
  runType: "SYNTHETIC_RECOVERY",
  status: "RUNNING",
  workItemId: "d07cb2ae-3b18-46d4-8c2d-aeaaf3bbce2f",
  workItemStatus: "LEASED",
  completedSteps: 1,
  attemptCount: 1,
  failureCode: null,
  failureDetail: null,
  createdAt: "2026-09-04T08:00:00Z",
  updatedAt: "2026-09-04T08:01:00Z",
  completedAt: null,
  attempts: [
    {
      id: "d07cb2ae-3b18-46d4-8c2d-aeaaf3bbce3f",
      attemptNumber: 1,
      workerId: "private-runner",
      runnerGeneration: 7,
      startedAt: "2026-09-04T08:00:00Z",
      lastHeartbeatAt: "2026-09-04T08:01:00Z",
      finishedAt: null,
      outcome: "ACTIVE",
      failureCode: null,
    },
  ],
  checkpoints: [
    {
      id: "d07cb2ae-3b18-46d4-8c2d-aeaaf3bbce4f",
      attemptId: "d07cb2ae-3b18-46d4-8c2d-aeaaf3bbce3f",
      step: "PREPARE",
      stepIndex: 0,
      evidenceSha256: "a".repeat(64),
      createdAt: "2026-09-04T08:00:30Z",
    },
  ],
  events: [
    {
      id: "d07cb2ae-3b18-46d4-8c2d-aeaaf3bbce5f",
      eventType: "RUN_CREATED",
      payload: {},
      occurredAt: "2026-09-04T08:00:00Z",
    },
  ],
};
