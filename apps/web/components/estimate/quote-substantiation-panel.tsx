import type { QuoteSubstantiation } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type QuoteSubstantiationPanelProps = {
  substantiation: QuoteSubstantiation;
};

export function QuoteSubstantiationPanel({ substantiation }: QuoteSubstantiationPanelProps) {
  const segment = substantiation.benchmark_segment;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Partner preview
            </p>
            <CardTitle>
              <h2>Quote substantiation pack</h2>
            </CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>{segment.segment_label}</Badge>
            <Badge variant="outline">{segment.sample_size} comparable matters</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 text-sm">
        <dl className="grid gap-3 md:grid-cols-3">
          {substantiation.metrics.map((metric) => (
            <div key={`${metric.label}-${metric.segment_label}`} className="rounded-lg border border-border p-3">
              <dt className="text-muted-foreground">{metric.label}</dt>
              <dd className="mt-1 text-xl font-semibold">{metric.display_value}</dd>
              <p className="mt-2 text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </dl>

        <div className="grid gap-3 md:grid-cols-2">
          {substantiation.chart_specs.map((chart) => (
            <div key={chart.chart_type} className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="font-medium">{chart.title}</p>
              <p className="mt-1 text-muted-foreground">{chart.description}</p>
              <ul className="mt-3 space-y-1 text-muted-foreground">
                {chart.data.slice(0, 4).map((point, index) => (
                  <li key={`${chart.chart_type}-${index}`}>{formatChartPoint(point)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-muted/40 p-3">
          <p className="font-medium">Assumptions and guardrails</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
            {substantiation.assumptions_and_guardrails.map((guardrail) => (
              <li key={guardrail}>{guardrail}</li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Evidence footer</p>
          <p>{substantiation.evidence_footer.join(" | ")}</p>
          {substantiation.snapshot_checksum ? <p>Snapshot checksum: {substantiation.snapshot_checksum}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function formatChartPoint(point: Record<string, string | number | boolean | null>) {
  const entries = Object.entries(point).map(([key, value]) => `${humanize(key)}: ${value}`);
  return entries.join(", ");
}

function humanize(value: string) {
  return value.replaceAll("_", " ");
}
