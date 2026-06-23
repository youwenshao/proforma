"use client";

import type { ModelEvaluation } from "@/lib/api/types";
import { formatNumber } from "@/lib/format";
import { ModelPerformanceChart } from "@/components/charts/model-performance-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

type EvaluationSummaryProps = {
  evaluation: ModelEvaluation;
};

const metricLabelKeys: Record<string, TranslationKey> = {
  calibration_method: "models.calibrationMethod",
  empirical_coverage: "models.rangeCoverage",
  mae: "models.averageError",
  rmse: "models.largeErrorSensitivity",
  smape: "models.relativeError",
};

export function EvaluationSummary({ evaluation }: EvaluationSummaryProps) {
  const t = useTranslations();
  const calibrationMethod = evaluation.metrics.calibration_method ?? "residual quantiles";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("models.evaluationSummary")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          <p className="font-medium">{t("models.calibrationMethod")}</p>
          <p className="text-muted-foreground">
            {t("models.calibrationDescription", { method: calibrationMethod })}
          </p>
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
          <p className="mb-2 text-sm font-medium">{t("models.errorByMatterType")}</p>
          <ModelPerformanceChart metricsByMatterType={evaluation.metrics_by_matter_type} />
        </div>
        <Table aria-label={t("models.metricsByMatterType")}>
          <TableHeader>
            <TableRow>
              <TableHead>{t("models.matterType")}</TableHead>
              <TableHead>MAE</TableHead>
              <TableHead>RMSE</TableHead>
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
