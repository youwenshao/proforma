"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { buildStageEffortData } from "@/lib/chart-data";
import type { StageEstimate } from "@/lib/api/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useTranslations } from "@/lib/i18n/locale-context";
import { useMemo } from "react";

type StageEffortChartProps = {
  stages: StageEstimate[];
};

export function StageEffortChart({ stages }: StageEffortChartProps) {
  const t = useTranslations();

  const chartConfig = useMemo(
    () =>
      ({
        partnerHours: {
          label: t("charts.partnerHours"),
          color: "var(--chart-2)",
        },
        associateHours: {
          label: t("charts.associateHours"),
          color: "var(--chart-1)",
        },
      }) satisfies ChartConfig,
    [t],
  );

  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
      <BarChart accessibilityLayer data={buildStageEffortData(stages)} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="stage"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: string) => value.slice(0, 14)}
        />
        <YAxis tickLine={false} axisLine={false} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="partnerHours" fill="var(--color-partnerHours)" radius={4} />
        <Bar dataKey="associateHours" fill="var(--color-associateHours)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
