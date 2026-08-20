import { MemoryRouter, useLocation } from "react-router-dom";

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

const state = vi.hoisted(() => ({
  data: undefined as unknown,
  isLoading: false,
  error: null as unknown,
}));
vi.mock("../../hooks/useVacancyStatistics", () => ({ useVacancyStatistics: () => state }));
vi.mock("@/features/jobs/hooks/useJobSources", () => ({ useJobSources: () => ({ data: [] }) }));

import { StatisticsPage } from "../StatisticsPage";

const Location = () => <output data-testid="location">{useLocation().search}</output>;
const renderPage = (path = "/statistics") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <StatisticsPage />
      <Location />
    </MemoryRouter>
  );

beforeEach(() => {
  state.data = undefined;
  state.isLoading = false;
  state.error = null;
});

describe("StatisticsPage", () => {
  it("shows loading and error states", () => {
    state.isLoading = true;
    const { rerender } = renderPage();
    expect(screen.getByText("Vacancy history")).toBeInTheDocument();
    state.isLoading = false;
    state.error = new Error("offline");
    rerender(
      <MemoryRouter>
        <StatisticsPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Vacancy history is unavailable")).toBeInTheDocument();
  });

  it("shows empty state and hides post-rollout exact warning", () => {
    state.data = {
      from: "2026-08-20T00:00:00Z",
      to: "2026-08-21T00:00:00Z",
      bucket: "DAY",
      exactSince: "2026-08-10T00:00:00Z",
      sourceCoverageSince: "2026-08-12T00:00:00Z",
      points: [],
    };
    renderPage("/statistics?range=7d");
    expect(screen.getByText("No vacancy history for this period")).toBeInTheDocument();
    expect(screen.queryByText(/Decision categories are exact/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Source coverage/)).not.toBeInTheDocument();
  });

  it("uses URL preset, bucket and source query state", () => {
    renderPage("/statistics?range=all&bucket=DAY&source=linkedin");
    expect(screen.getByTestId("location")).toHaveTextContent("range=all");
    expect(screen.getByText("All")).toBeInTheDocument();
  });
});
