"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { FeeRecommendation } from "@/lib/api/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  value: {
    label: "HKD",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

type FeeGuardrailChartProps = {
  fee: FeeRecommendation;
};

export function FeeGuardrailChart({ fee }: FeeGuardrailChartProps) {
  const data = [
    { label: "Low bound", value: fee.confidence_interval_low_hkd },
    { label: "Recommended", value: fee.recommended_fee_hkd },
    { label: "High bound", value: fee.confidence_interval_high_hkd },
    { label: "Downside", value: fee.downside_risk_hkd ?? fee.expected_downside_hkd ?? 0 },
  ];

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
