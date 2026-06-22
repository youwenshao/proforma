import type { ModelEvaluation } from "@/lib/api/types";
import { formatNumber } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type EvaluationSummaryProps = {
  evaluation: ModelEvaluation;
};

export function EvaluationSummary({ evaluation }: EvaluationSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluation summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          <p className="font-medium">Calibration method</p>
          <p className="text-muted-foreground">
            {evaluation.metrics.calibration_method ?? "residual quantiles"}.
            Segment residual quantiles are used when a matter type has enough
            support; sparse segments fall back to global residual quantiles.
          </p>
        </div>
        <dl className="grid gap-3 text-sm md:grid-cols-4">
          {Object.entries(evaluation.metrics).map(([key, value]) => (
            <div key={key}>
              <dt className="text-muted-foreground">{key}</dt>
              <dd className="font-medium">
                {typeof value === "number" ? formatNumber(value, 3) : value}
              </dd>
            </div>
          ))}
        </dl>
        <Table aria-label="Metrics by matter type">
          <TableHeader>
            <TableRow>
              <TableHead>Matter type</TableHead>
              <TableHead>MAE</TableHead>
              <TableHead>RMSE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(evaluation.metrics_by_matter_type).map(([matterType, metrics]) => (
              <TableRow key={matterType}>
                <TableCell className="font-medium">{matterType}</TableCell>
                <TableCell>{formatNumber(metrics.mae ?? 0, 0)}</TableCell>
                <TableCell>{formatNumber(metrics.rmse ?? 0, 0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
