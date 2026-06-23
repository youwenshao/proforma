"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { buildModelPerformanceData } from "@/lib/chart-data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useTranslations } from "@/lib/i18n/locale-context";
import { useMemo } from "react";

type ModelPerformanceChartProps = {
  metricsByMatterType: Record<string, Record<string, number>>;
};

export function ModelPerformanceChart({ metricsByMatterType }: ModelPerformanceChartProps) {
  const t = useTranslations();

  const chartConfig = useMemo(
    () =>
      ({
        averageError: {
          label: t("charts.averageError"),
          color: "var(--chart-1)",
        },
        largeErrorSensitivity: {
          label: t("charts.largeErrorSensitivity"),
          color: "var(--chart-5)",
        },
      }) satisfies ChartConfig,
    [t],
  );

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
