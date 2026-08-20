/* eslint-disable no-restricted-exports -- React.lazy requires a default export. */
import { useEffect, useRef } from "react";

import { LineChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

import type { VacancyStatisticsPoint } from "../types";
import { vacancyStatisticsChartOption } from "./chartOptions";

echarts.use([
  LineChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

interface VacancyStatisticsChartProps {
  points: VacancyStatisticsPoint[];
  exactSince: string | null;
}

const VacancyStatisticsChart = ({ points, exactSince }: VacancyStatisticsChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const chart = echarts.init(element);
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(element);
    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const chart = echarts.getInstanceByDom(element);
    chart?.setOption(vacancyStatisticsChartOption(points, exactSince), true);
  }, [exactSince, points]);

  return (
    <div
      ref={containerRef}
      className="statistics-chart"
      role="img"
      aria-label="Vacancy history chart"
    />
  );
};

export default VacancyStatisticsChart;
