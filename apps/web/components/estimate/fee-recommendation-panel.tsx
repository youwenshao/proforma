"use client";

import type { FeeRecommendation } from "@/lib/api/types";
import { formatCurrency } from "@/lib/format";
import { FeeGuardrailChart } from "@/components/charts/fee-guardrail-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n/locale-context";

type FeeRecommendationPanelProps = {
  fee: FeeRecommendation;
  riskTolerance: string;
};

export function FeeRecommendationPanel({ fee, riskTolerance }: FeeRecommendationPanelProps) {
  const t = useTranslations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("fee.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge>{fee.billing_model}</Badge>
          <Badge variant="outline">{t("fee.riskTolerance", { value: riskTolerance })}</Badge>
        </div>
        <FeeGuardrailChart fee={fee} />
        <dl className="grid gap-3 md:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">{t("fee.fixedFeeSuggestion")}</dt>
            <dd className="text-xl font-semibold">{formatCurrency(fee.recommended_fee_hkd)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("fee.cappedFeeSuggestion")}</dt>
            <dd className="text-xl font-semibold">
              {formatCurrency(fee.cap_amount_hkd ?? fee.confidence_interval_high_hkd)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("fee.downsideWarning")}</dt>
            <dd className="font-medium">
              {fee.expected_downside_hkd
                ? formatCurrency(fee.expected_downside_hkd)
                : t("fee.downsideWarningDefault")}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("fee.expectedMargin")}</dt>
            <dd className="font-medium">
              {fee.expected_margin_hkd != null
                ? formatCurrency(fee.expected_margin_hkd)
                : t("common.notAvailable")}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("fee.downsideRisk")}</dt>
            <dd className="font-medium">
              {fee.downside_risk_hkd != null
                ? formatCurrency(fee.downside_risk_hkd)
                : t("common.notAvailable")}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("fee.marginPercent")}</dt>
            <dd className="font-medium">
              {fee.margin_pct != null ? `${Math.round(fee.margin_pct * 100)}%` : t("common.notAvailable")}
            </dd>
          </div>
        </dl>
        {fee.pricing_guardrails?.length ? (
          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <p className="font-medium">{t("fee.pricingGuardrails")}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              {fee.pricing_guardrails.map((guardrail) => (
                <li key={guardrail}>{guardrail}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="text-muted-foreground">
          {t("fee.recommendationNote", {
            low: formatCurrency(fee.confidence_interval_low_hkd),
            high: formatCurrency(fee.confidence_interval_high_hkd),
          })}
        </p>
      </CardContent>
    </Card>
  );
}
