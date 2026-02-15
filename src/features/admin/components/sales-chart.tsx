"use client";

import { useEffect, useRef } from "react";
import { createChart, type IChartApi, ColorType, AreaSeries, HistogramSeries } from "lightweight-charts";

interface ChartDataPoint {
  time: string;
  value: number;
}

interface SalesChartProps {
  data: ChartDataPoint[];
  type?: "area" | "histogram";
  height?: number;
}

export function SalesChart({
  data,
  type = "area",
  height = 300,
}: SalesChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    // lightweight-charts requires yyyy-mm-dd format
    const normalizedData = data
      .map((d) => ({
        ...d,
        time: d.time.slice(0, 10),
      }))
      .sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0));

    const chart = createChart(containerRef.current, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "hsl(0, 0%, 55%)",
        fontFamily: "var(--font-mono), monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: "hsl(0, 0%, 12%)", style: 3 },
      },
      crosshair: {
        vertLine: { color: "hsl(0, 0%, 30%)", width: 1, style: 2, labelBackgroundColor: "hsl(0, 0%, 14%)" },
        horzLine: { color: "hsl(0, 0%, 30%)", width: 1, style: 2, labelBackgroundColor: "hsl(0, 0%, 14%)" },
      },
      rightPriceScale: {
        borderColor: "hsl(0, 0%, 16%)",
      },
      timeScale: {
        borderColor: "hsl(0, 0%, 16%)",
      },
      handleScroll: false,
      handleScale: false,
    });

    if (type === "area") {
      const series = chart.addSeries(AreaSeries, {
        lineColor: "hsl(0, 0%, 90%)",
        lineWidth: 2,
        topColor: "rgba(255, 255, 255, 0.15)",
        bottomColor: "rgba(255, 255, 255, 0)",
        crosshairMarkerRadius: 4,
        crosshairMarkerBackgroundColor: "white",
      });
      series.setData(normalizedData);
    } else {
      const series = chart.addSeries(HistogramSeries, {
        color: "hsl(0, 0%, 40%)",
      });
      series.setData(normalizedData);
    }

    chart.timeScale().fitContent();
    chartRef.current = chart;

    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [data, type, height]);

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-[hsl(0_0%_40%)] text-sm"
        style={{ height }}
      >
        Sin datos disponibles
      </div>
    );
  }

  return <div ref={containerRef} />;
}
