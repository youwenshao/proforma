"use client";

import Link from "next/link";
import { Activity, ArrowRight, FilePlus2, History, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { getDemoSession, type DemoSession } from "@/lib/demo-auth";
import { getSavedEstimates, type SavedEstimate } from "@/lib/estimate-history";
import { formatCurrency, formatPercent } from "@/lib/format";
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
            <h2>Sign in to view saved results</h2>
          </CardTitle>
          <CardDescription>
            Demo history is stored in this browser and grouped by the email you use to sign in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/login">
              <LogIn aria-hidden="true" />
              Sign in
            </Link>
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
            <h2>No saved prediction results yet</h2>
          </CardTitle>
          <CardDescription>
            Create an estimate while signed in, and it will appear here for this browser profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/estimate/new">
              <FilePlus2 aria-hidden="true" />
              Create estimate
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {saved.map((record) => (
        <article
          aria-label={`${record.matterSummary.matterType} estimate`}
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
                {record.matterSummary.matterType} estimate
              </CardTitle>
              <CardDescription>{record.matterSummary.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <dt className="text-muted-foreground">Typical cost</dt>
                  <dd className="font-semibold">{formatCurrency(record.estimate.cost_estimate.p50)}</dd>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <dt className="text-muted-foreground">Typical duration</dt>
                  <dd className="font-semibold">{Math.round(record.estimate.duration_estimate.p50)} days</dd>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <dt className="text-muted-foreground">Chance work grows</dt>
                  <dd className="font-semibold">
                    {formatPercent(record.estimate.scope_creep_probability)}
                  </dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href={`/estimate/${record.estimate.estimate_id}`}>
                    Open result
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/monitoring/${record.estimate.estimate_id}`}>
                    <Activity aria-hidden="true" />
                    Monitoring
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </article>
      ))}
    </div>
  );
}
