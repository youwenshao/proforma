import type { EstimateResponse } from "@/lib/api/types";
import { formatCurrency, formatNumber } from "@/lib/format";
import { totalPredictedHours, variancePct as calculateVariancePct } from "@/lib/api/scope-monitoring";
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scope monitoring dashboard</CardTitle>
        <CardDescription>
          Compares synthetic predicted stage effort against structured actual updates.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
