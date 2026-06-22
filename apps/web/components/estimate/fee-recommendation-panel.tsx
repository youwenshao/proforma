import type { FeeRecommendation } from "@/lib/api/types";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FeeRecommendationPanelProps = {
  fee: FeeRecommendation;
  riskTolerance: string;
};

export function FeeRecommendationPanel({ fee, riskTolerance }: FeeRecommendationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee recommendation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge>{fee.billing_model}</Badge>
          <Badge variant="outline">Risk tolerance: {riskTolerance}</Badge>
        </div>
        <dl className="grid gap-3 md:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Fixed-fee suggestion</dt>
            <dd className="text-xl font-semibold">
              {formatCurrency(fee.recommended_fee_hkd)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Capped-fee suggestion</dt>
            <dd className="text-xl font-semibold">
              {formatCurrency(fee.cap_amount_hkd ?? fee.confidence_interval_high_hkd)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Downside warning</dt>
            <dd className="font-medium">
              {fee.expected_downside_hkd
                ? formatCurrency(fee.expected_downside_hkd)
                : "Review p90 exposure before client use"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Expected margin</dt>
            <dd className="font-medium">
              {fee.expected_margin_hkd != null
                ? formatCurrency(fee.expected_margin_hkd)
                : "Not available"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Downside risk</dt>
            <dd className="font-medium">
              {fee.downside_risk_hkd != null
                ? formatCurrency(fee.downside_risk_hkd)
                : "Not available"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Margin percent</dt>
            <dd className="font-medium">
              {fee.margin_pct != null ? `${Math.round(fee.margin_pct * 100)}%` : "Not available"}
            </dd>
          </div>
        </dl>
        {fee.pricing_guardrails?.length ? (
          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <p className="font-medium">Pricing guardrails</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              {fee.pricing_guardrails.map((guardrail) => (
                <li key={guardrail}>{guardrail}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="text-muted-foreground">
          Recommendation uses the model interval from{" "}
          {formatCurrency(fee.confidence_interval_low_hkd)} to{" "}
          {formatCurrency(fee.confidence_interval_high_hkd)} and applies the
          configured risk tolerance. Partner final decision required.
        </p>
      </CardContent>
    </Card>
  );
}
