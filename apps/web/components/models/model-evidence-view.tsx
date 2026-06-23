import type {
  ModelCurrent,
  ModelEvaluation,
  SimilarMatterEvidence,
  StrategyComparison,
} from "@/lib/api/types";
import { ModelFlowDiagram } from "@/components/charts/model-flow-diagram";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const metricExplainers = [
  {
    label: "MAE",
    description:
      "MAE tells us the typical size of a cost miss in HKD. Lower is better, and it is most useful when compared within the same matter mix.",
  },
  {
    label: "RMSE",
    description:
      "RMSE also measures cost error, but gives extra weight to large misses. We look for it to fall without being driven by a few extreme matters.",
  },
  {
    label: "sMAPE",
    description:
      "sMAPE is a percentage-style error measure. Lower is better, and it helps compare small and large matters without treating HKD size alone as the story.",
  },
  {
    label: "Range coverage",
    description:
      "Range coverage checks how often actual outcomes land inside the model range. We want it close to the stated confidence level, not perfect certainty.",
  },
  {
    label: "ROC-AUC",
    description:
      "ROC-AUC is for classifiers, such as scope-creep risk. Higher means risky matters are ranked ahead of stable ones more often than chance.",
  },
  {
    label: "Scope-creep and overrun rates",
    description:
      "These rates check whether the synthetic world creates enough overruns to exercise alerts. The validation report targeted realistic stress, not a market forecast.",
  },
  {
    label: "Correlations",
    description:
      "Correlations check whether drivers move in sensible directions, such as more documents with more hours or complexity with higher cost.",
  },
];

export function ModelEvidenceView({
  current,
  evaluation,
  similarMatterEvidence,
  strategyComparison,
}: ModelEvidenceViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Model evidence
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Feasibility evidence package
        </h1>
      </div>
      <Alert>
        <AlertTitle>Synthetic data and governance context</AlertTitle>
        <AlertDescription>
          The current model evidence is based on {current.dataset_lineage.source_marker};
          pooled use remains gated by legal review.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <h2 className="font-heading text-base leading-snug font-medium">
            How the synthetic validation dataset was built
          </h2>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="font-medium">What it is</p>
              <p className="mt-1 text-muted-foreground">
                A reproducible generator created 4,000 synthetic Hong Kong matters
                under {current.dataset_lineage.dataset_id}, marked{" "}
                {current.dataset_lineage.source_marker}.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="font-medium">How it was synthesized</p>
              <p className="mt-1 text-muted-foreground">
                The dataset uses structured numeric and domain distributions, seed
                20260622, and validation rules; it is not LLM-written narratives.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="font-medium">What it proves</p>
              <p className="mt-1 text-muted-foreground">
                It supports pre-real-data validation of features, calibration, and
                review workflows. It is not production market proof or a real-firm
                accuracy claim.
              </p>
            </div>
          </div>
          <div>
            <p className="font-medium">What the metrics mean</p>
            <dl className="mt-3 grid gap-3 md:grid-cols-2">
              {metricExplainers.map((metric) => (
                <div key={metric.label} className="rounded-lg border border-border p-3">
                  <dt className="font-medium">{metric.label}</dt>
                  <dd className="mt-1 text-muted-foreground">{metric.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </CardContent>
      </Card>
      <ModelCurrentCard current={current} />
      <Card>
        <CardHeader>
          <CardTitle>How the estimate evidence flows</CardTitle>
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
