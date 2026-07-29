"use client";

import type { ModelEvaluation } from "@/lib/api/types";
import { formatNumber } from "@/lib/format";
import { ModelPerformanceChart } from "@/components/charts/model-performance-chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "@/lib/i18n/locale-context";
import type { TranslationKey } from "@/lib/i18n/en";
import { EvidenceCardTitle } from "./evidence-card-title";

type EvaluationSummaryProps = {
  evaluation: ModelEvaluation;
};

const metricLabelKeys: Record<string, TranslationKey> = {
  calibration_method: "models.rangeMethod",
  empirical_coverage: "models.rangeCoverageLabel",
  mae: "models.maeLabel",
  rmse: "models.rmseLabel",
  smape: "models.smapeLabel",
};

const metricExplainerKeys: Array<{ labelKey: TranslationKey; descriptionKey: TranslationKey }> = [
  { labelKey: "models.maeLabel", descriptionKey: "models.maeDesc" },
  { labelKey: "models.rmseLabel", descriptionKey: "models.rmseDesc" },
  { labelKey: "models.smapeLabel", descriptionKey: "models.smapeDesc" },
  { labelKey: "models.rangeCoverageLabel", descriptionKey: "models.rangeCoverageDesc" },
  { labelKey: "models.rocAucLabel", descriptionKey: "models.rocAucDesc" },
  { labelKey: "models.scopeCreepRatesLabel", descriptionKey: "models.scopeCreepRatesDesc" },
  { labelKey: "models.correlationsLabel", descriptionKey: "models.correlationsDesc" },
];

export function EvaluationSummary({ evaluation }: EvaluationSummaryProps) {
  const t = useTranslations();
  const calibrationMethod = evaluation.metrics.calibration_method ?? "residual quantiles";

  return (
    <Card>
      <CardHeader>
        <EvidenceCardTitle>{t("models.evaluationSummary")}</EvidenceCardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          <p className="font-medium">{t("models.holdoutExplainer")}</p>
          <p className="text-muted-foreground">{t("models.holdoutExplainerBody")}</p>
        </div>
        <dl className="grid gap-3 text-sm md:grid-cols-4">
          {Object.entries(evaluation.metrics).map(([key, value]) => (
            <div key={key}>
              <dt className="text-muted-foreground">
                {metricLabelKeys[key] ? t(metricLabelKeys[key]) : key}
              </dt>
              <dd className="font-medium">
                {typeof value === "number" ? formatNumber(value, 3) : value}
              </dd>
            </div>
          ))}
        </dl>
        <div>
          <p className="text-sm font-medium">{t("models.whatMetricsMean")}</p>
          <dl className="mt-3 grid gap-3 text-sm md:grid-cols-2">
            {metricExplainerKeys.map((metric) => (
              <div className="rounded-lg border border-border p-3" key={metric.labelKey}>
                <dt className="font-medium">{t(metric.labelKey)}</dt>
                <dd className="mt-1 text-muted-foreground">{t(metric.descriptionKey)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          <p className="font-medium">{t("models.calibrationMethod")}</p>
          <p className="text-muted-foreground">
            {t("models.calibrationDescription", { method: calibrationMethod })}
          </p>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">{t("models.errorByMatterType")}</p>
          <p className="mb-3 text-sm text-muted-foreground">{t("models.errorByMatterTypeNote")}</p>
          <ModelPerformanceChart metricsByMatterType={evaluation.metrics_by_matter_type} />
        </div>
        <Table aria-label={t("models.metricsByMatterType")}>
          <TableHeader>
            <TableRow>
              <TableHead>{t("models.matterType")}</TableHead>
              <TableHead>{t("models.maeLabel")}</TableHead>
              <TableHead>{t("models.rmseLabel")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(evaluation.metrics_by_matter_type).map(([matterType, metrics]) => (
              <TableRow key={matterType}>
                <TableCell className="font-medium">{matterType}</TableCell>
                <TableCell>{formatNumber(metrics.mae ?? 0, 0)}</TableCell>
                <TableCell>{formatNumber(metrics.rmse ?? 0, 0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
