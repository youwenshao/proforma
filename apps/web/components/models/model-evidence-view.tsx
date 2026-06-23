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
