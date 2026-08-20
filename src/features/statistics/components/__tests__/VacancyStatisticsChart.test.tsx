import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const chart = { resize: vi.fn(), dispose: vi.fn(), setOption: vi.fn() };
const core = vi.hoisted(() => ({
  init: vi.fn(() => chart),
  getInstanceByDom: vi.fn(() => chart),
  use: vi.fn(),
}));
vi.mock("echarts/core", () => core);

import VacancyStatisticsChart from "../VacancyStatisticsChart";

describe("VacancyStatisticsChart", () => {
  it("initializes once, updates options, responds to resize and disposes", () => {
    const observer = { observe: vi.fn(), disconnect: vi.fn() };
    let resizeCallback: (() => void) | undefined;
    class ResizeObserverMock {
      constructor(callback: () => void) {
        resizeCallback = callback;
      }
      observe = observer.observe;
      disconnect = observer.disconnect;
    }
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    const points = [
      {
        start: "2026-08-20T00:00:00Z",
        allVacancies: 1,
        coldRejected: 0,
        notFullyRemote: 0,
        aiScored: 1,
        legacyRejectedUnknown: 0,
        medianScore: 70,
      },
    ];
    const { rerender, unmount } = render(
      <VacancyStatisticsChart points={points} exactSince={null} />
    );
    expect(core.init).toHaveBeenCalledTimes(1);
    expect(chart.setOption).toHaveBeenCalledTimes(1);
    resizeCallback?.();
    expect(chart.resize).toHaveBeenCalledTimes(1);
    rerender(<VacancyStatisticsChart points={[...points]} exactSince="2026-08-20T00:00:00Z" />);
    expect(chart.setOption).toHaveBeenCalledTimes(2);
    unmount();
    expect(observer.disconnect).toHaveBeenCalled();
    expect(chart.dispose).toHaveBeenCalled();
  });
});
