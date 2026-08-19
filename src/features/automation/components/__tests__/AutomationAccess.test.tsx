import { MemoryRouter, Route, Routes } from "react-router-dom";

import { act, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { Sidebar } from "@/components/Layout/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthContext, type AuthContextValue, PERMISSIONS } from "@/hooks/useAuth";

vi.mock("@/components/AppVersion", () => ({ AppVersion: () => null }));

describe("automation access", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  it("redirects authenticated users without read:automation", () => {
    renderRoute(auth([]));

    expect(screen.getByText("Explore fallback")).toBeInTheDocument();
    expect(screen.queryByText("Private automation")).not.toBeInTheDocument();
  });

  it("renders only with read:automation", () => {
    renderRoute(auth([PERMISSIONS.READ_AUTOMATION]));

    expect(screen.getByText("Private automation")).toBeInTheDocument();
  });

  it("does not expose the private route when OIDC is disabled", () => {
    renderRoute({ ...auth([]), isAuthenticated: false, isConfigured: false });

    expect(screen.getByText("Explore fallback")).toBeInTheDocument();
  });

  it("hides the navigation item without read:automation", async () => {
    renderSidebar(auth([]));
    await flushAntUpdates();
    expect(screen.queryByText("Automation")).not.toBeInTheDocument();
  });

  it("shows the navigation item with read:automation", async () => {
    renderSidebar(auth([PERMISSIONS.READ_AUTOMATION]));
    await flushAntUpdates();
    expect(screen.getByText("Automation")).toBeInTheDocument();
  });
});

function renderRoute(value: AuthContextValue): void {
  render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={["/automation"]}>
        <Routes>
          <Route path="/explore" element={<div>Explore fallback</div>} />
          <Route
            path="/automation"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.READ_AUTOMATION}>
                <div>Private automation</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

function renderSidebar(value: AuthContextValue) {
  return render(sidebar(value));
}

async function flushAntUpdates(): Promise<void> {
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
}

function sidebar(value: AuthContextValue) {
  return (
    <AuthContext.Provider value={value}>
      <MemoryRouter>
        <Sidebar
          collapsed={false}
          onCollapse={vi.fn()}
          isDark
          onThemeToggle={vi.fn()}
          newJobsCount={0}
        />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

function auth(permissions: string[]): AuthContextValue {
  return {
    isAuthenticated: true,
    isLoading: false,
    isConfigured: true,
    permissions,
    loginWithRedirect: vi.fn(() => Promise.resolve()),
    logout: vi.fn(() => Promise.resolve()),
    getAccessTokenSilently: vi.fn(() => Promise.resolve("token")),
  };
}
