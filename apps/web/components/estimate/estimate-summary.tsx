import type { EstimateInterval } from "@/lib/api/types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { EstimateIntervalChart } from "@/components/charts/estimate-interval-chart";
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
        unit="HKD"
      />
      <IntervalCard
        ariaLabel="Duration uncertainty"
        formatValue={(value) => `${formatNumber(value)} days`}
        interval={duration}
        title="Duration uncertainty"
        unit="days"
      />
      <Card>
        <CardHeader>
          <CardTitle>Chance work grows</CardTitle>
          <CardDescription>Model version {modelVersion}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">
            {formatPercent(scopeCreepProbability)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            This is the estimated chance that effort grows beyond the original scope. It is
            decision-support evidence, not autonomous legal or pricing advice.
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
  unit: string;
};

function IntervalCard({ ariaLabel, formatValue, interval, title, unit }: IntervalCardProps) {
  const intervalLabels: Array<{ key: "p10" | "p50" | "p90"; label: string }> = [
    { key: "p10", label: "Low" },
    { key: "p50", label: "Typical" },
    { key: "p90", label: "High" },
  ];

  return (
    <Card aria-label={ariaLabel} role="region">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Low, typical, and high estimates at {formatPercent(interval.confidence_level)} confidence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-3 gap-3 text-sm">
          {intervalLabels.map(({ key, label }) => (
            <div key={key}>
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-semibold">{formatValue(interval[key])}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4">
          <EstimateIntervalChart interval={interval} unit={unit} />
        </div>
      </CardContent>
    </Card>
  );
}
