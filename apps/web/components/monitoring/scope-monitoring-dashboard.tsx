import type { EstimateResponse } from "@/lib/api/types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { totalPredictedHours, variancePct as calculateVariancePct } from "@/lib/api/scope-monitoring";
import { ScopeVarianceChart } from "@/components/charts/scope-variance-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VarianceBadge, varianceStatus } from "./variance-badge";

type ScopeMonitoringDashboardProps = {
  estimate: EstimateResponse;
};

export function ScopeMonitoringDashboard({ estimate }: ScopeMonitoringDashboardProps) {
  const rows = estimate.stage_estimates.map((stage, index) => {
    const predictedHours = totalPredictedHours(stage);
    const multiplier = index === 0 ? 1.08 : index === 1 ? 1.18 : 0.98;
    const actualHours = predictedHours * multiplier;
    const actualCost = stage.cost_hkd * multiplier;
    const variancePct = calculateVariancePct(predictedHours, actualHours);
    const status = varianceStatus(variancePct);

    return {
      actualCost,
      actualHours,
      predictedCost: stage.cost_hkd,
      predictedHours,
      recommendedReviewAction:
        status === "Critical"
          ? "Critical variance: partner review required before further fixed-fee work proceeds."
          : status === "Warning"
            ? "Recommended review action: pricing support should review scope assumptions."
            : "Continue monitoring against the current estimate.",
      stageName: stage.stage_name,
      variancePct,
    };
  });
  const predictedTotalCost = rows.reduce((total, row) => total + row.predictedCost, 0);
  const predictedTotalHours = rows.reduce((total, row) => total + row.predictedHours, 0);
  const actualTotalCost = rows.reduce((total, row) => total + row.actualCost, 0);
  const actualTotalHours = rows.reduce((total, row) => total + row.actualHours, 0);
  const costMultiplier = predictedTotalCost ? Math.max(actualTotalCost / predictedTotalCost, 1) : 1;
  const hoursMultiplier = predictedTotalHours ? Math.max(actualTotalHours / predictedTotalHours, 1) : 1;
  const reforecastFinalCost = predictedTotalCost * costMultiplier;
  const reforecastFinalHours = predictedTotalHours * hoursMultiplier;
  const maxVariancePct = Math.max(...rows.map((row) => row.variancePct));
  const overrunProbability = Math.min(0.95, Math.max(0.1, 0.2 + maxVariancePct / 100));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scope monitoring dashboard</CardTitle>
        <CardDescription>
          Compares synthetic predicted stage effort against structured actual updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded-lg border border-border p-3">
            <dt className="text-muted-foreground">Reforecast final cost</dt>
            <dd className="text-lg font-semibold">{formatCurrency(reforecastFinalCost)}</dd>
          </div>
          <div className="rounded-lg border border-border p-3">
            <dt className="text-muted-foreground">Reforecast final hours</dt>
            <dd className="text-lg font-semibold">{formatNumber(reforecastFinalHours, 1)}</dd>
          </div>
          <div className="rounded-lg border border-border p-3">
            <dt className="text-muted-foreground">Overrun probability</dt>
            <dd className="text-lg font-semibold">{formatPercent(overrunProbability)}</dd>
          </div>
        </dl>
        <div>
          <p className="mb-2 text-sm font-medium">Predicted vs actual stage effort</p>
          <ScopeVarianceChart stages={estimate.stage_estimates} />
        </div>
        <Table aria-label="Scope monitoring variance">
          <TableHeader>
            <TableRow>
              <TableHead>Stage</TableHead>
              <TableHead>Predicted hours</TableHead>
              <TableHead>Actual hours</TableHead>
              <TableHead>Predicted cost</TableHead>
              <TableHead>Actual cost</TableHead>
              <TableHead>Variance</TableHead>
              <TableHead>Recommended review action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.stageName}>
                <TableCell className="font-medium">{row.stageName}</TableCell>
                <TableCell>{formatNumber(row.predictedHours, 1)}</TableCell>
                <TableCell>{formatNumber(row.actualHours, 1)}</TableCell>
                <TableCell>{formatCurrency(row.predictedCost)}</TableCell>
                <TableCell>{formatCurrency(row.actualCost)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <VarianceBadge variancePct={row.variancePct} />
                    <span>{formatNumber(row.variancePct, 1)}%</span>
                  </div>
                </TableCell>
                <TableCell>{row.recommendedReviewAction}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
