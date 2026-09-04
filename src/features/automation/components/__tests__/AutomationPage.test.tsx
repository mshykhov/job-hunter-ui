import { type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AutomationPage } from "@/features/automation/components/AutomationPage";
import type { AutomationStatus } from "@/features/automation/types";

const API_URL = "http://localhost:8095/automation/status";
const server = setupServer(
  http.get("http://localhost:8095/automation/workflows/runs", () => HttpResponse.json([]))
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("AutomationPage", () => {
  it.each([
    ["READY", "Automation is ready"],
    ["DEGRADED", "Automation is degraded"],
    ["AUTH_REQUIRED", "Authentication is required"],
    ["UNAVAILABLE", "Automation is unavailable"],
  ] as const)("renders the %s state", async (state, expected) => {
    const user = userEvent.setup();
    server.use(
      http.get(API_URL, () =>
        HttpResponse.json(status({ state, reason: state === "READY" ? "NONE" : "OTHER" }))
      )
    );

    renderPage();

    expect(await screen.findByText(expected)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Automation" })).toBeInTheDocument();
    expect(screen.getByText("Runtime diagnostics · 8 checks")).toBeInTheDocument();
    await user.click(screen.getByText("Runtime diagnostics · 8 checks"));
    expect(screen.getByText("LAUNCHER")).toBeInTheDocument();
    expect(screen.getAllByText("0.1.0").length).toBeGreaterThan(0);
  });

  it("shows loading and a bounded access denied error", async () => {
    server.use(http.get(API_URL, () => new HttpResponse(null, { status: 403 })));

    renderPage();

    expect(document.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    expect(await screen.findByText("Access denied")).toBeInTheDocument();
  });

  it("does not render unknown server reasons or missing timestamps as data", async () => {
    const user = userEvent.setup();
    server.use(
      http.get(API_URL, () =>
        HttpResponse.json(
          status({
            reason: "private backend detail" as AutomationStatus["reason"],
            lastHeartbeatAt: null,
          })
        )
      )
    );

    renderPage();

    expect(await screen.findByText("Automation is ready")).toBeInTheDocument();
    await user.click(screen.getByText("Runtime diagnostics · 8 checks"));
    expect(screen.getAllByText("Never").length).toBeGreaterThan(0);
    expect(screen.queryByText("private backend detail")).not.toBeInTheDocument();
  });
});

function renderPage(): void {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <Providers queryClient={queryClient}>
      <AutomationPage />
    </Providers>
  );
}

function Providers({ children, queryClient }: { children: ReactNode; queryClient: QueryClient }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function status(overrides: Partial<AutomationStatus> = {}): AutomationStatus {
  return {
    enabled: true,
    state: "READY",
    reason: "NONE",
    components: {
      LAUNCHER: {
        state: "READY",
        reason: "NONE",
        checkedAt: "2026-08-18T08:00:00Z",
        probeVersion: "0.1.0",
      },
    },
    launcherVersion: "0.1.0",
    lastHeartbeatAt: "2026-08-18T08:00:00Z",
    lastPreflightSuccessAt: "2026-08-18T08:00:00Z",
    lastCodexSuccessAt: "2026-08-18T08:00:00Z",
    ...overrides,
  };
}
