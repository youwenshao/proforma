"use client";

import type { EstimateInterval } from "@/lib/api/types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { EstimateIntervalChart } from "@/components/charts/estimate-interval-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n/locale-context";

type EstimateSummaryProps = {
  cost: EstimateInterval;
  duration: EstimateInterval;
  scopeCreepProbability: number;
  modelVersion: string;
};

export function EstimateSummary({
  cost,
  duration,
  modelVersion,
  scopeCreepProbability,
}: EstimateSummaryProps) {
  const t = useTranslations();

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <IntervalCard
        formatValue={formatCurrency}
        interval={cost}
        title={t("summary.costUncertainty")}
        unit="HKD"
      />
      <IntervalCard
        formatValue={(value) => `${formatNumber(value)} ${t("summary.daysUnit")}`}
        interval={duration}
        title={t("summary.durationUncertainty")}
        unit={t("summary.daysUnit")}
      />
      <Card>
        <CardHeader>
          <CardTitle>{t("summary.chanceWorkGrows")}</CardTitle>
          <CardDescription>{t("summary.modelVersion", { version: modelVersion })}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{formatPercent(scopeCreepProbability)}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("summary.chanceWorkGrowsBody")}</p>
        </CardContent>
      </Card>
    </div>
  );
}

type IntervalCardProps = {
  formatValue: (value: number) => string;
  interval: EstimateInterval;
  title: string;
  unit: string;
};

function IntervalCard({ formatValue, interval, title, unit }: IntervalCardProps) {
  const t = useTranslations();

  const intervalLabels: Array<{ key: "p10" | "p50" | "p90"; label: string }> = [
    { key: "p10", label: t("summary.low") },
    { key: "p50", label: t("summary.typical") },
    { key: "p90", label: t("summary.high") },
  ];

  return (
    <Card aria-label={title} role="region">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {t("summary.confidenceDescription", {
            confidence: formatPercent(interval.confidence_level),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-3 gap-3 text-sm">
          {intervalLabels.map(({ key, label }) => (
            <div key={key}>
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-semibold">{formatValue(interval[key])}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4">
          <EstimateIntervalChart interval={interval} unit={unit} />
        </div>
      </CardContent>
    </Card>
  );
}
