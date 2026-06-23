import { BackAction } from "@/components/back-action";
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
    <main className="min-h-[calc(100vh-4rem)] bg-muted/20 px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap gap-2">
          <BackAction href={`/estimate/${estimateId}`} label="Estimate" />
          <BackAction href="/" label="Home" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Scope monitoring
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Is the matter still tracking to plan?
          </h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Compare expected stage effort with current actuals. Variance warnings help a partner
            decide whether scope assumptions need review.
          </p>
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
