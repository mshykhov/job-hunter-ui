/* eslint-disable no-restricted-exports -- React.lazy requires a default export. */
import { useEffect, useRef } from "react";

import { LineChart } from "echarts/charts";
import {
  AriaComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

import type { VacancyStatisticsPoint, VacancyStatsBucket } from "../types";
import { vacancyStatisticsChartOption } from "./chartOptions";

echarts.use([
  LineChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  DataZoomComponent,
  AriaComponent,
  CanvasRenderer,
]);

interface VacancyStatisticsChartProps {
  points: VacancyStatisticsPoint[];
  exactSince: string | null;
  bucket: VacancyStatsBucket;
}

const VacancyStatisticsChart = ({ points, exactSince, bucket }: VacancyStatisticsChartProps) => {
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
    chart?.setOption(vacancyStatisticsChartOption(points, exactSince, bucket), true);
  }, [bucket, exactSince, points]);

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
