"use client";

import type {
  ModelArtifactIndex,
  ModelCurrent,
  ModelEvaluation,
  SimilarMatterEvidence,
  StrategyComparison,
} from "@/lib/api/types";
import { ModelFlowDiagram } from "@/components/charts/model-flow-diagram";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n/locale-context";
import type { TranslationKey } from "@/lib/i18n/en";
import { EvaluationSummary } from "./evaluation-summary";
import { EvidenceCardTitle } from "./evidence-card-title";
import { EvidenceGlossary } from "./evidence-glossary";
import { ModelCurrentCard } from "./model-current-card";
import { SimilarMatterEvidenceCard } from "./similar-matter-evidence-card";
import { StrategyComparison as StrategyComparisonCard } from "./strategy-comparison";

type ModelEvidenceViewProps = {
  artifactIndex: ModelArtifactIndex;
  current: ModelCurrent;
  evaluation: ModelEvaluation;
  similarMatterEvidence: SimilarMatterEvidence;
  strategyComparison: StrategyComparison;
};

const sanityCheckKeys: TranslationKey[] = [
  "models.sanityCheck1",
  "models.sanityCheck2",
  "models.sanityCheck3",
  "models.sanityCheck4",
  "models.sanityCheck5",
  "models.sanityCheck6",
];

export function ModelEvidenceView({
  artifactIndex,
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
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{t("models.lede")}</p>
      </div>
      <Alert>
        <AlertTitle>{t("models.syntheticGovernance")}</AlertTitle>
        <AlertDescription>
          {t("models.syntheticGovernanceBody", {
            marker: current.dataset_lineage.source_marker,
          })}
        </AlertDescription>
      </Alert>
      <EvidenceGlossary />
      <Card>
        <CardHeader>
          <EvidenceCardTitle>{t("models.datasetBuilt")}</EvidenceCardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
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
            <p className="font-medium">{t("models.reproducibility")}</p>
            <p className="mt-1 text-muted-foreground">{t("models.reproducibilityBody")}</p>
          </div>
          <div>
            <p className="font-medium">{t("models.sanityChecks")}</p>
            <p className="mt-1 text-muted-foreground">{t("models.sanityChecksBody")}</p>
            <ul className="mt-3 grid list-disc gap-2 pl-5 text-muted-foreground md:grid-cols-2">
              {sanityCheckKeys.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      <ModelCurrentCard artifactIndex={artifactIndex} current={current} />
      <Card>
        <CardHeader>
          <EvidenceCardTitle>{t("models.flowTitle")}</EvidenceCardTitle>
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
