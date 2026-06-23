"use client";

import Link from "next/link";
import { Activity, ArrowRight, Brain, History, LogIn, PlusCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getDemoSession, type DemoSession } from "@/lib/demo-auth";
import { getSavedEstimates, type SavedEstimate } from "@/lib/estimate-history";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DashboardOverview() {
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
            Saved results
          </CardTitle>
          <CardDescription>
            {session
              ? `Browser-local history for ${session.email}.`
              : "Sign in to keep a local list of predictions."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-4xl font-semibold">{saved.length}</p>
          <p className="text-sm text-muted-foreground">
            Previously created predictions available from this browser.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/results">
                <History aria-hidden="true" />
                View saved results
              </Link>
            </Button>
            {!session ? (
              <Button asChild variant="outline">
                <Link href="/login">
                  <LogIn aria-hidden="true" />
                  Sign in
                </Link>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity aria-hidden="true" className="h-4 w-4 text-primary" />
            Average growth risk
          </CardTitle>
          <CardDescription>Plain-English scope-growth signal.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">
            {averageScopeGrowth == null ? "No data" : formatPercent(averageScopeGrowth)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Chance the work grows beyond the original assumptions.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain aria-hidden="true" className="h-4 w-4 text-primary" />
            Model status
          </CardTitle>
          <CardDescription>Synthetic feasibility model.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">Ready</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Evidence is available, but production use still needs review.
          </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Most recent prediction</CardTitle>
          <CardDescription>
            The fastest path back into an active estimate, if you have one saved.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          {recent ? (
            <>
              <div>
                <p className="font-medium">
                  {recent.matterSummary.matterType} · {recent.matterSummary.subtitle}
                </p>
                <p className="text-sm text-muted-foreground">
                  Typical cost {formatCurrency(recent.estimate.cost_estimate.p50)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href={`/estimate/${recent.estimate.estimate_id}`}>
                    Open result
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/monitoring/${recent.estimate.estimate_id}`}>
                    <Activity aria-hidden="true" />
                    Monitoring
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Create a prediction to see the most recent result here.
              </p>
              <Button asChild>
                <Link href="/estimate/new">
                  <PlusCircle aria-hidden="true" />
                  Start estimate
                </Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
