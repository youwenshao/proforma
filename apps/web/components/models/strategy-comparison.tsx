import type { StrategyComparison as StrategyComparisonType } from "@/lib/api/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StrategyComparisonProps = {
  strategyComparison: StrategyComparisonType;
};

export function StrategyComparison({ strategyComparison }: StrategyComparisonProps) {
  const firmSpecific = strategyComparison.tracks.firm_specific;
  const pooled = strategyComparison.tracks.pooled_research;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firm-specific versus pooled tracks</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-border p-4">
          <h2 className="font-medium">Firm-specific track</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {firmSpecific?.description ?? "Firm-specific evidence unavailable."}
          </p>
          {firmSpecific?.minimum_records_per_firm ? (
            <p className="mt-2 text-sm">
              Minimum records per firm: {firmSpecific.minimum_records_per_firm}
            </p>
          ) : null}
        </section>
        <section className="rounded-lg border border-border p-4">
          <h2 className="font-medium">Pooled research track</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {pooled?.description ?? "Pooled evidence unavailable."}
          </p>
          {pooled?.legal_gate_status ? (
            <Alert className="mt-3" variant="destructive">
              <AlertTitle>Legal gate status</AlertTitle>
              <AlertDescription>{pooled.legal_gate_status}</AlertDescription>
            </Alert>
          ) : null}
        </section>
      </CardContent>
    </Card>
  );
}
