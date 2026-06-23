"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { buildVarianceDistributionData } from "@/lib/chart-data";
import type { QuotePackChartSpec } from "@/lib/api/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  sharePct: {
    label: "Share of matters (%)",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

type VarianceDistributionChartProps = {
  spec: QuotePackChartSpec;
};

export function VarianceDistributionChart({ spec }: VarianceDistributionChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-48 w-full">
      <BarChart
        accessibilityLayer
        data={buildVarianceDistributionData(spec.data)}
        margin={{ left: 8, right: 8 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="bucket" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={32} unit="%" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="sharePct" fill="var(--color-sharePct)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
