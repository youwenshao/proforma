import Link from "next/link";
import { ScopeMonitoringDashboard } from "@/components/monitoring/scope-monitoring-dashboard";
import { StageUpdateForm } from "@/components/monitoring/stage-update-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEstimate } from "@/lib/api/estimates";

type MonitoringPageProps = {
  params: Promise<{ estimateId: string }>;
};

export default async function MonitoringPage({ params }: MonitoringPageProps) {
  const { estimateId } = await params;
  const estimate = await getEstimate(estimateId);

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl space-y-8">
        <Link className="text-sm text-muted-foreground underline-offset-4 hover:underline" href={`/estimate/${estimateId}`}>
          Back to estimate
        </Link>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Scope monitoring
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Stage variance for {estimateId}
          </h1>
        </div>
        {estimate ? (
          <>
            <ScopeMonitoringDashboard estimate={estimate} />
            <Card>
              <CardHeader>
                <CardTitle>Post stage update</CardTitle>
              </CardHeader>
              <CardContent>
                <StageUpdateForm estimateId={estimate.estimate_id} stages={estimate.stage_estimates} />
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Estimate not found</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Scope monitoring requires an existing estimate.
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
