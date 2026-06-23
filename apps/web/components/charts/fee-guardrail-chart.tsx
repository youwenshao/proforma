"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { FeeRecommendation } from "@/lib/api/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useTranslations } from "@/lib/i18n/locale-context";
import { useMemo } from "react";

type FeeGuardrailChartProps = {
  fee: FeeRecommendation;
};

export function FeeGuardrailChart({ fee }: FeeGuardrailChartProps) {
  const t = useTranslations();

  const chartConfig = useMemo(
    () =>
      ({
        value: {
          label: "HKD",
          color: "var(--chart-3)",
        },
      }) satisfies ChartConfig,
    [],
  );

  const data = useMemo(
    () => [
      { label: t("charts.lowBound"), value: fee.confidence_interval_low_hkd },
      { label: t("charts.recommended"), value: fee.recommended_fee_hkd },
      { label: t("charts.highBound"), value: fee.confidence_interval_high_hkd },
      { label: t("charts.downside"), value: fee.downside_risk_hkd ?? fee.expected_downside_hkd ?? 0 },
    ],
    [fee, t],
  );

  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <LineChart accessibilityLayer data={data}>
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
