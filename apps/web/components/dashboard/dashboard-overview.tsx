"use client";

import { LocalizedLink } from "@/components/localized-link";
import { Activity, ArrowRight, Brain, History, LogIn, PlusCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getDemoSession, type DemoSession } from "@/lib/demo-auth";
import { getSavedEstimates, type SavedEstimate } from "@/lib/estimate-history";
import { formatCurrency, formatPercent } from "@/lib/format";
import { useTranslations } from "@/lib/i18n/locale-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DashboardOverview() {
  const t = useTranslations();
  const [session, setSession] = useState<DemoSession | null>(null);
  const [saved, setSaved] = useState<SavedEstimate[]>([]);

  useEffect(() => {
    function sync() {
      const activeSession = getDemoSession();
      setSession(activeSession);
      setSaved(activeSession ? getSavedEstimates(activeSession.email) : []);
    }

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("proforma-demo-session", sync);
    window.addEventListener("proforma-estimate-history", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("proforma-demo-session", sync);
      window.removeEventListener("proforma-estimate-history", sync);
    };
  }, []);

  const averageScopeGrowth = useMemo(() => {
    if (!saved.length) {
      return null;
    }

    return (
      saved.reduce((total, record) => total + record.estimate.scope_creep_probability, 0) /
      saved.length
    );
  }, [saved]);

  const recent = saved[0];

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History aria-hidden="true" className="h-4 w-4 text-primary" />
            {t("dashboard.savedResults")}
          </CardTitle>
          <CardDescription>
            {session
              ? t("dashboard.savedResultsSignedIn", { email: session.email })
              : t("dashboard.savedResultsSignedOut")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-4xl font-semibold">{saved.length}</p>
          <p className="text-sm text-muted-foreground">{t("dashboard.savedResultsCount")}</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <LocalizedLink href="/results">
                <History aria-hidden="true" />
                {t("dashboard.viewSavedResults")}
              </LocalizedLink>
            </Button>
            {!session ? (
              <Button asChild variant="outline">
                <LocalizedLink href="/login">
                  <LogIn aria-hidden="true" />
                  {t("nav.signIn")}
                </LocalizedLink>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity aria-hidden="true" className="h-4 w-4 text-primary" />
            {t("dashboard.averageGrowthRisk")}
          </CardTitle>
          <CardDescription>{t("dashboard.averageGrowthRiskDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">
            {averageScopeGrowth == null ? t("common.noData") : formatPercent(averageScopeGrowth)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("dashboard.averageGrowthRiskBody")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain aria-hidden="true" className="h-4 w-4 text-primary" />
            {t("dashboard.modelStatus")}
          </CardTitle>
          <CardDescription>{t("dashboard.modelStatusDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{t("dashboard.modelStatusReady")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("dashboard.modelStatusBody")}</p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>{t("dashboard.mostRecent")}</CardTitle>
          <CardDescription>{t("dashboard.mostRecentDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          {recent ? (
            <>
              <div>
                <p className="font-medium">
                  {recent.matterSummary.matterType} · {recent.matterSummary.subtitle}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("dashboard.typicalCost", {
                    amount: formatCurrency(recent.estimate.cost_estimate.p50),
                  })}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <LocalizedLink href={`/estimate/${recent.estimate.estimate_id}`}>
                    {t("dashboard.openResult")}
                    <ArrowRight aria-hidden="true" />
                  </LocalizedLink>
                </Button>
                <Button asChild variant="outline">
                  <LocalizedLink href={`/monitoring/${recent.estimate.estimate_id}`}>
                    <Activity aria-hidden="true" />
                    {t("common.monitoring")}
                  </LocalizedLink>
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">{t("dashboard.createPrediction")}</p>
              <Button asChild>
                <LocalizedLink href="/estimate/new">
                  <PlusCircle aria-hidden="true" />
                  {t("dashboard.startEstimate")}
                </LocalizedLink>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
