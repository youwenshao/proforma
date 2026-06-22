import Link from "next/link";
import type { EstimateResponse, ModelStrategy } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EstimateSummary } from "./estimate-summary";
import { FeeRecommendationPanel } from "./fee-recommendation-panel";
import { LimitationsAlert } from "./limitations-alert";
import { StageBreakdownTable } from "./stage-breakdown-table";

type EstimateResultsViewProps = {
  estimate: EstimateResponse | null;
  modelStrategy: ModelStrategy;
};

export function EstimateResultsView({ estimate, modelStrategy }: EstimateResultsViewProps) {
  if (!estimate) {
    return (
      <Card>
        <CardHeader>
          <h1 className="text-base font-medium leading-snug">Estimate not found</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The requested estimate is unavailable in this feasibility frontend.
          </p>
          <Button asChild>
            <Link href="/estimate/new">Create a new estimate</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Estimate review
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Prediction result {estimate.estimate_id}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/monitoring/${estimate.estimate_id}`}>Open scope monitoring</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/models">Model evidence</Link>
          </Button>
        </div>
      </div>

      <LimitationsAlert
        decisionSupportDisclaimer={estimate.decision_support_disclaimer}
        limitations={estimate.limitations}
        showLegalGate={modelStrategy === "pooled_research"}
      />

      <EstimateSummary
        cost={estimate.cost_estimate}
        duration={estimate.duration_estimate}
        modelVersion={estimate.model_version}
        scopeCreepProbability={estimate.scope_creep_probability}
      />

      <FeeRecommendationPanel
        fee={estimate.fee_recommendation}
        riskTolerance={modelStrategy === "pooled_research" ? "pooled research" : "balanced"}
      />

      <Card>
        <CardHeader>
          <CardTitle>Stage breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <StageBreakdownTable stages={estimate.stage_estimates} />
        </CardContent>
      </Card>
    </div>
  );
}
