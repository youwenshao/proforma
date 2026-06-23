"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { buildEstimateIntervalData } from "@/lib/chart-data";
import type { EstimateInterval } from "@/lib/api/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  value: {
    label: "Estimate",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type EstimateIntervalChartProps = {
  interval: EstimateInterval;
  unit: string;
};

export function EstimateIntervalChart({ interval, unit }: EstimateIntervalChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-44 w-full">
      <LineChart accessibilityLayer data={buildEstimateIntervalData(interval, unit)}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis hide />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Line
          dataKey="value"
          dot={{ fill: "var(--color-value)", r: 5 }}
          stroke="var(--color-value)"
          strokeWidth={3}
          type="monotone"
        />
      </LineChart>
    </ChartContainer>
  );
}
