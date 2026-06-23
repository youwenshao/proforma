"use client";

import type {
  ModelCurrent,
  ModelEvaluation,
  SimilarMatterEvidence,
  StrategyComparison,
} from "@/lib/api/types";
import { ModelFlowDiagram } from "@/components/charts/model-flow-diagram";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n/locale-context";
import type { TranslationKey } from "@/lib/i18n/en";
import { EvaluationSummary } from "./evaluation-summary";
import { ModelCurrentCard } from "./model-current-card";
import { SimilarMatterEvidenceCard } from "./similar-matter-evidence-card";
import { StrategyComparison as StrategyComparisonCard } from "./strategy-comparison";

type ModelEvidenceViewProps = {
  current: ModelCurrent;
  evaluation: ModelEvaluation;
  similarMatterEvidence: SimilarMatterEvidence;
  strategyComparison: StrategyComparison;
};

const metricExplainerKeys: Array<{ label: string; descriptionKey: TranslationKey }> = [
  { label: "MAE", descriptionKey: "models.maeDesc" },
  { label: "RMSE", descriptionKey: "models.rmseDesc" },
  { label: "sMAPE", descriptionKey: "models.smapeDesc" },
  { label: "Range coverage", descriptionKey: "models.rangeCoverageDesc" },
  { label: "ROC-AUC", descriptionKey: "models.rocAucDesc" },
  { label: "Scope-creep and overrun rates", descriptionKey: "models.scopeCreepRatesDesc" },
  { label: "Correlations", descriptionKey: "models.correlationsDesc" },
];

export function ModelEvidenceView({
  current,
  evaluation,
  similarMatterEvidence,
  strategyComparison,
}: ModelEvidenceViewProps) {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          {t("models.eyebrow")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{t("models.title")}</h1>
      </div>
      <Alert>
        <AlertTitle>{t("models.syntheticGovernance")}</AlertTitle>
        <AlertDescription>
          {t("models.syntheticGovernanceBody", {
            marker: current.dataset_lineage.source_marker,
          })}
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <h2 className="font-heading text-base leading-snug font-medium">
            {t("models.datasetBuilt")}
          </h2>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="font-medium">{t("models.whatItIs")}</p>
              <p className="mt-1 text-muted-foreground">
                {t("models.whatItIsBody", {
                  datasetId: current.dataset_lineage.dataset_id,
                  marker: current.dataset_lineage.source_marker,
                })}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="font-medium">{t("models.howSynthesized")}</p>
              <p className="mt-1 text-muted-foreground">{t("models.howSynthesizedBody")}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="font-medium">{t("models.whatItProves")}</p>
              <p className="mt-1 text-muted-foreground">{t("models.whatItProvesBody")}</p>
            </div>
          </div>
          <div>
            <p className="font-medium">{t("models.whatMetricsMean")}</p>
            <dl className="mt-3 grid gap-3 md:grid-cols-2">
              {metricExplainerKeys.map((metric) => (
                <div key={metric.label} className="rounded-lg border border-border p-3">
                  <dt className="font-medium">{metric.label}</dt>
                  <dd className="mt-1 text-muted-foreground">{t(metric.descriptionKey)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </CardContent>
      </Card>
      <ModelCurrentCard current={current} />
      <Card>
        <CardHeader>
          <CardTitle>{t("models.flowTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ModelFlowDiagram />
        </CardContent>
      </Card>
      <EvaluationSummary evaluation={evaluation} />
      <StrategyComparisonCard strategyComparison={strategyComparison} />
      <SimilarMatterEvidenceCard evidence={similarMatterEvidence} />
    </div>
  );
}
