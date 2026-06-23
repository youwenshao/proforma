"use client";

import { LocalizedLink } from "@/components/localized-link";
import { Activity, ArrowRight, FilePlus2, History, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { getDemoSession, type DemoSession } from "@/lib/demo-auth";
import { getSavedEstimates, type SavedEstimate } from "@/lib/estimate-history";
import { formatCurrency, formatPercent } from "@/lib/format";
import { useTranslations } from "@/lib/i18n/locale-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SavedResultsView() {
  const t = useTranslations();
  const [session, setSession] = useState<DemoSession | null>(null);
  const [saved, setSaved] = useState<SavedEstimate[]>([]);

  useEffect(() => {
    function syncHistory() {
      const activeSession = getDemoSession();
      setSession(activeSession);
      setSaved(activeSession ? getSavedEstimates(activeSession.email) : []);
    }

    syncHistory();
    window.addEventListener("storage", syncHistory);
    window.addEventListener("proforma-demo-session", syncHistory);
    window.addEventListener("proforma-estimate-history", syncHistory);

    return () => {
      window.removeEventListener("storage", syncHistory);
      window.removeEventListener("proforma-demo-session", syncHistory);
      window.removeEventListener("proforma-estimate-history", syncHistory);
    };
  }, []);

  if (!session) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>
            <h2>{t("results.signInToView")}</h2>
          </CardTitle>
          <CardDescription>{t("results.signInDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <LocalizedLink href="/login">
              <LogIn aria-hidden="true" />
              {t("nav.signIn")}
            </LocalizedLink>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (saved.length === 0) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>
            <h2>{t("results.noSaved")}</h2>
          </CardTitle>
          <CardDescription>{t("results.noSavedDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <LocalizedLink href="/estimate/new">
              <FilePlus2 aria-hidden="true" />
              {t("results.createEstimate")}
            </LocalizedLink>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {saved.map((record) => (
        <article
          aria-label={`${record.matterSummary.matterType} ${t("results.estimateSuffix")}`}
          className="contents"
          key={record.estimate.estimate_id}
        >
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                <Badge>{record.matterSummary.billingModel}</Badge>
                <Badge variant="outline">{record.matterSummary.jurisdiction}</Badge>
              </div>
              <CardTitle className="flex items-center gap-2">
                <History aria-hidden="true" className="h-4 w-4 text-primary" />
                {record.matterSummary.matterType} {t("results.estimateSuffix")}
              </CardTitle>
              <CardDescription>{record.matterSummary.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <dt className="text-muted-foreground">{t("results.typicalCost")}</dt>
                  <dd className="font-semibold">{formatCurrency(record.estimate.cost_estimate.p50)}</dd>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <dt className="text-muted-foreground">{t("results.typicalDuration")}</dt>
                  <dd className="font-semibold">
                    {Math.round(record.estimate.duration_estimate.p50)} {t("common.days")}
                  </dd>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <dt className="text-muted-foreground">{t("results.chanceWorkGrows")}</dt>
                  <dd className="font-semibold">
                    {formatPercent(record.estimate.scope_creep_probability)}
                  </dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <LocalizedLink href={`/estimate/${record.estimate.estimate_id}`}>
                    {t("results.openResult")}
                    <ArrowRight aria-hidden="true" />
                  </LocalizedLink>
                </Button>
                <Button asChild variant="outline">
                  <LocalizedLink href={`/monitoring/${record.estimate.estimate_id}`}>
                    <Activity aria-hidden="true" />
                    {t("common.monitoring")}
                  </LocalizedLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        </article>
      ))}
    </div>
  );
}
