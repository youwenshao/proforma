"use client";

import type { StrategyComparison as StrategyComparisonType } from "@/lib/api/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n/locale-context";
import { EvidenceCardTitle } from "./evidence-card-title";

type StrategyComparisonProps = {
  strategyComparison: StrategyComparisonType;
};

export function StrategyComparison({ strategyComparison }: StrategyComparisonProps) {
  const t = useTranslations();
  const firmSpecific = strategyComparison.tracks.firm_specific;
  const pooled = strategyComparison.tracks.pooled_research;

  return (
    <Card>
      <CardHeader>
        <EvidenceCardTitle>{t("models.firmVsPooled")}</EvidenceCardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-border p-4">
          <h3 className="font-medium">{t("models.firmSpecific")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t("models.firmSpecificBody")}</p>
          {firmSpecific?.minimum_records_per_firm ? (
            <p className="mt-2 text-sm">
              {t("models.minimumRecords", { count: firmSpecific.minimum_records_per_firm })}
            </p>
          ) : null}
          <p className="mt-3 text-xs text-muted-foreground">
            <span className="font-medium">{t("models.technicalNote")}: </span>
            {firmSpecific?.description ?? t("models.firmSpecificUnavailable")}
          </p>
        </section>
        <section className="rounded-lg border border-border p-4">
          <h3 className="font-medium">{t("models.pooledResearch")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t("models.pooledResearchBody")}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            <span className="font-medium">{t("models.technicalNote")}: </span>
            {pooled?.description ?? t("models.pooledUnavailable")}
          </p>
          {pooled?.legal_gate_status ? (
            <Alert className="mt-3" variant="destructive">
              <AlertTitle>{t("models.legalGateStatus")}</AlertTitle>
              <AlertDescription>{pooled.legal_gate_status}</AlertDescription>
            </Alert>
          ) : null}
        </section>
      </CardContent>
    </Card>
  );
}
