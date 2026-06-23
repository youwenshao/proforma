"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { buildModelPerformanceData } from "@/lib/chart-data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  averageError: {
    label: "Average error",
    color: "var(--chart-1)",
  },
  largeErrorSensitivity: {
    label: "Large-error sensitivity",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

type ModelPerformanceChartProps = {
  metricsByMatterType: Record<string, Record<string, number>>;
};

export function ModelPerformanceChart({ metricsByMatterType }: ModelPerformanceChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
      <BarChart
        accessibilityLayer
        data={buildModelPerformanceData(metricsByMatterType)}
        margin={{ left: 8, right: 8 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="matterType"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: string) => value.slice(0, 14)}
        />
        <YAxis hide />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="averageError" fill="var(--color-averageError)" radius={4} />
        <Bar
          dataKey="largeErrorSensitivity"
          fill="var(--color-largeErrorSensitivity)"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
}
