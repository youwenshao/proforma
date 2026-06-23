"use client";

import type { EstimateResponse } from "@/lib/api/types";
import { BackAction } from "@/components/back-action";
import { ScopeMonitoringDashboard } from "@/components/monitoring/scope-monitoring-dashboard";
import { StageUpdateForm } from "@/components/monitoring/stage-update-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n/locale-context";

type MonitoringPageContentProps = {
  estimate: EstimateResponse | null;
  estimateId: string;
};

export function MonitoringPageContent({ estimate, estimateId }: MonitoringPageContentProps) {
  const t = useTranslations();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/20 px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap gap-2">
          <BackAction href={`/estimate/${estimateId}`} label={t("nav.estimate")} />
          <BackAction href="/" label={t("nav.home")} />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            {t("monitoring.eyebrow")}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{t("monitoring.title")}</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">{t("monitoring.description")}</p>
        </div>
        {estimate ? (
          <>
            <ScopeMonitoringDashboard estimate={estimate} />
            <Card>
              <CardHeader>
                <CardTitle>{t("monitoring.postStageUpdate")}</CardTitle>
              </CardHeader>
              <CardContent>
                <StageUpdateForm estimateId={estimate.estimate_id} stages={estimate.stage_estimates} />
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t("monitoring.estimateNotFound")}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              {t("monitoring.estimateNotFoundBody")}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
