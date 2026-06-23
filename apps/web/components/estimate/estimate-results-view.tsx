"use client";

import { LocalizedLink } from "@/components/localized-link";
import type { EstimateResponse, ModelStrategy, QuoteSubstantiation } from "@/lib/api/types";
import { StageEffortChart } from "@/components/charts/stage-effort-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n/locale-context";
import { EstimateReference } from "./estimate-reference";
import { EstimateSummary } from "./estimate-summary";
import { FeeRecommendationPanel } from "./fee-recommendation-panel";
import { LimitationsAlert } from "./limitations-alert";
import { QuoteSubstantiationPanel } from "./quote-substantiation-panel";
import { StageBreakdownTable } from "./stage-breakdown-table";

type EstimateResultsViewProps = {
  estimate: EstimateResponse | null;
  modelStrategy: ModelStrategy;
  quoteSubstantiation?: QuoteSubstantiation | null;
};

export function EstimateResultsView({
  estimate,
  modelStrategy,
  quoteSubstantiation = null,
}: EstimateResultsViewProps) {
  const t = useTranslations();

  if (!estimate) {
    return (
      <Card>
        <CardHeader>
          <h1 className="text-base font-medium leading-snug">{t("estimate.notFound")}</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("estimate.notFoundBody")}</p>
          <Button asChild>
            <LocalizedLink href="/estimate/new">{t("estimate.createNew")}</LocalizedLink>
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
            {t("estimate.review")}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{t("estimate.predictionResult")}</h1>
          <EstimateReference referenceId={estimate.estimate_id} />
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <LocalizedLink href={`/monitoring/${estimate.estimate_id}`}>
              {t("estimate.openScopeMonitoring")}
            </LocalizedLink>
          </Button>
          <Button asChild variant="outline">
            <LocalizedLink href="/models">{t("nav.modelEvidence")}</LocalizedLink>
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

      {quoteSubstantiation ? (
        <QuoteSubstantiationPanel substantiation={quoteSubstantiation} />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{t("estimate.stageBreakdown")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StageEffortChart stages={estimate.stage_estimates} />
          <StageBreakdownTable stages={estimate.stage_estimates} />
        </CardContent>
      </Card>
    </div>
  );
}
