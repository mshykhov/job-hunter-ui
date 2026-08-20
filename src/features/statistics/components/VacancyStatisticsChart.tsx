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
}

export const VacancyStatisticsChart = ({ points }: VacancyStatisticsChartProps) => {
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
    chart?.setOption(vacancyStatisticsChartOption(points), true);
  }, [points]);

  return <div ref={containerRef} className="statistics-chart" aria-label="Vacancy history chart" />;
};
