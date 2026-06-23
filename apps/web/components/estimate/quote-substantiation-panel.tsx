"use client";

import type { QuoteSubstantiation } from "@/lib/api/types";
import { formatCurrency } from "@/lib/format";
import { StageCostShareChart } from "@/components/charts/stage-cost-share-chart";
import { VarianceDistributionChart } from "@/components/charts/variance-distribution-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n/locale-context";
import { QuotePackActions } from "./quote-pack-actions";

type QuoteSubstantiationPanelProps = {
  substantiation: QuoteSubstantiation;
};

export function QuoteSubstantiationPanel({ substantiation }: QuoteSubstantiationPanelProps) {
  const t = useTranslations();
  const segment = substantiation.benchmark_segment;

  const riskMetrics = substantiation.metrics.filter((m) =>
    ["Material scope-creep rate", "Any-overrun rate", "P75 quote variance", "P90 quote variance"].includes(m.label),
  );
  const benchmarkMetrics = substantiation.metrics.filter((m) =>
    ["Median comparable cost", "Median duration"].includes(m.label),
  );
  const otherMetrics = substantiation.metrics.filter(
    (m) => !riskMetrics.includes(m) && !benchmarkMetrics.includes(m),
  );

  const varianceSpec = substantiation.chart_specs.find((s) => s.chart_type === "variance_distribution");
  const stageShareSpec = substantiation.chart_specs.find((s) => s.chart_type === "stage_cost_share");

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              {t("quote.partnerPreview")}
            </p>
            <CardTitle>
              <h2>{t("quote.title")}</h2>
            </CardTitle>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{segment.segment_label}</Badge>
            <Badge variant="outline">
              {t("quote.comparableMatters", { count: segment.sample_size })}
            </Badge>
            <QuotePackActions estimateId={substantiation.estimate_id} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 text-sm">
        {riskMetrics.length > 0 && (
          <section aria-label={t("quote.riskMetricsAria")}>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              {t("quote.riskMetrics")}
            </p>
            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {riskMetrics.map((metric) => (
                <MetricCard key={metric.label} metric={metric} />
              ))}
            </dl>
          </section>
        )}

        {benchmarkMetrics.length > 0 && (
          <section aria-label={t("quote.benchmarkMetricsAria")}>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              {t("quote.benchmarkMetrics")}
            </p>
            <dl className="grid gap-3 sm:grid-cols-2">
              {benchmarkMetrics.map((metric) => (
                <MetricCard key={metric.label} metric={metric} prominent />
              ))}
            </dl>
          </section>
        )}

        {otherMetrics.length > 0 && (
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {otherMetrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </dl>
        )}

        {(varianceSpec || stageShareSpec) && (
          <section aria-label={t("quote.historicalChartsAria")}>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              {t("quote.historicalDistribution")}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {varianceSpec && (
                <div className="rounded-lg border border-border p-4">
                  <p className="mb-1 font-medium">{varianceSpec.title}</p>
                  <p className="mb-3 text-xs text-muted-foreground">{varianceSpec.description}</p>
                  <VarianceDistributionChart spec={varianceSpec} />
                </div>
              )}
              {stageShareSpec && (
                <div className="rounded-lg border border-border p-4">
                  <p className="mb-1 font-medium">{stageShareSpec.title}</p>
                  <p className="mb-3 text-xs text-muted-foreground">{stageShareSpec.description}</p>
                  <StageCostShareChart spec={stageShareSpec} />
                </div>
              )}
            </div>
          </section>
        )}

        {substantiation.assumptions_and_guardrails.length > 0 && (
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <p className="font-medium">{t("quote.assumptionsGuardrails")}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              {substantiation.assumptions_and_guardrails.map((guardrail) => (
                <li key={guardrail}>{guardrail}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-1 text-xs text-muted-foreground">
          {substantiation.evidence_footer.map((line) => (
            <p key={line}>{line}</p>
          ))}
          {substantiation.snapshot_checksum && (
            <p className="font-mono">
              {t("quote.checksum", { value: substantiation.snapshot_checksum })}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type MetricCardProps = {
  metric: {
    label: string;
    value: number | string;
    unit?: string | null;
    display_value: string;
    description: string;
    segment_label: string;
    sample_size: number;
  };
  prominent?: boolean;
};

function MetricCard({ metric, prominent = false }: MetricCardProps) {
  const formattedValue = formatMetricValue(metric);

  return (
    <div className="rounded-lg border border-border p-3">
      <dt className="text-xs text-muted-foreground">{metric.label}</dt>
      <dd className={prominent ? "mt-1 text-2xl font-semibold" : "mt-1 text-xl font-semibold"}>
        {formattedValue}
      </dd>
      <p className="mt-2 text-xs text-muted-foreground">{metric.description}</p>
    </div>
  );
}

function formatMetricValue(metric: {
  value: number | string;
  unit?: string | null;
  display_value: string;
}): string {
  if (metric.unit === "HKD" && typeof metric.value === "number") {
    return formatCurrency(metric.value);
  }
  return metric.display_value;
}
