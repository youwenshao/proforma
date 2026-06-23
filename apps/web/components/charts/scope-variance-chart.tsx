"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { buildVarianceData } from "@/lib/chart-data";
import type { StageEstimate } from "@/lib/api/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  predictedHours: {
    label: "Predicted hours",
    color: "var(--chart-2)",
  },
  actualHours: {
    label: "Actual hours",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

type ScopeVarianceChartProps = {
  stages: StageEstimate[];
};

export function ScopeVarianceChart({ stages }: ScopeVarianceChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
      <BarChart accessibilityLayer data={buildVarianceData(stages)} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="stage"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: string) => value.slice(0, 14)}
        />
        <YAxis tickLine={false} axisLine={false} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="predictedHours" fill="var(--color-predictedHours)" radius={4} />
        <Bar dataKey="actualHours" fill="var(--color-actualHours)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
