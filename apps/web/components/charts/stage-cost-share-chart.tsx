"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { buildStageCostShareData } from "@/lib/chart-data";
import type { QuotePackChartSpec } from "@/lib/api/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useTranslations } from "@/lib/i18n/locale-context";
import { useMemo } from "react";

type StageCostShareChartProps = {
  spec: QuotePackChartSpec;
};

export function StageCostShareChart({ spec }: StageCostShareChartProps) {
  const t = useTranslations();

  const chartConfig = useMemo(
    () =>
      ({
        avgSharePct: {
          label: t("charts.avgCostShare"),
          color: "var(--chart-2)",
        },
      }) satisfies ChartConfig,
    [t],
  );

  return (
    <ChartContainer config={chartConfig} className="h-48 w-full">
      <BarChart
        accessibilityLayer
        data={buildStageCostShareData(spec.data)}
        margin={{ left: 8, right: 8 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="stage"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: string) => value.slice(0, 14)}
        />
        <YAxis tickLine={false} axisLine={false} width={32} unit="%" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="avgSharePct" fill="var(--color-avgSharePct)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
