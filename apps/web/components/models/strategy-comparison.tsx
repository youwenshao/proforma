"use client";

import type { StrategyComparison as StrategyComparisonType } from "@/lib/api/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n/locale-context";

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
        <CardTitle>{t("models.firmVsPooled")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-border p-4">
          <h2 className="font-medium">{t("models.firmSpecific")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {firmSpecific?.description ?? t("models.firmSpecificUnavailable")}
          </p>
          {firmSpecific?.minimum_records_per_firm ? (
            <p className="mt-2 text-sm">
              {t("models.minimumRecords", { count: firmSpecific.minimum_records_per_firm })}
            </p>
          ) : null}
        </section>
        <section className="rounded-lg border border-border p-4">
          <h2 className="font-medium">{t("models.pooledResearch")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
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
