import type { EstimateInterval } from "@/lib/api/types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EstimateSummaryProps = {
  cost: EstimateInterval;
  duration: EstimateInterval;
  scopeCreepProbability: number;
  modelVersion: string;
};

export function EstimateSummary({
  cost,
  duration,
  modelVersion,
  scopeCreepProbability,
}: EstimateSummaryProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <IntervalCard
        ariaLabel="Cost uncertainty"
        formatValue={formatCurrency}
        interval={cost}
        title="Cost uncertainty"
      />
      <IntervalCard
        ariaLabel="Duration uncertainty"
        formatValue={(value) => `${formatNumber(value)} days`}
        interval={duration}
        title="Duration uncertainty"
      />
      <Card>
        <CardHeader>
          <CardTitle>Scope-creep signal</CardTitle>
          <CardDescription>Model version {modelVersion}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">
            {formatPercent(scopeCreepProbability)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Probability is feasibility evidence, not autonomous legal or pricing advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

type IntervalCardProps = {
  ariaLabel: string;
  formatValue: (value: number) => string;
  interval: EstimateInterval;
  title: string;
};

function IntervalCard({ ariaLabel, formatValue, interval, title }: IntervalCardProps) {
  return (
    <Card aria-label={ariaLabel} role="region">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {interval.calibration_method}, {formatPercent(interval.confidence_level)} confidence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-3 gap-3 text-sm">
          {(["p10", "p50", "p90"] as const).map((key) => (
            <div key={key}>
              <dt className="text-muted-foreground">{key.toUpperCase()}</dt>
              <dd className="font-semibold">{formatValue(interval[key])}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
