"use client";

import type { DecisionImpact } from "@/lib/api/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n/locale-context";

type DecisionImpactPanelProps = {
  decisionImpact?: DecisionImpact | null;
};

export function DecisionImpactPanel({ decisionImpact }: DecisionImpactPanelProps) {
  const t = useTranslations();

  if (!decisionImpact) {
    return null;
  }

  if (decisionImpact.unavailable_reason || decisionImpact.factors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("impact.title")}</CardTitle>
          <CardDescription>{t("impact.unavailable")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {decisionImpact.unavailable_reason ?? t("impact.unavailableBody")}
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxWeight = Math.max(...decisionImpact.factors.map((factor) => factor.weight_pct), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("impact.title")}</CardTitle>
        <CardDescription>{t("impact.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-3">
          {decisionImpact.factors.map((factor) => (
            <li key={factor.feature} className="space-y-1">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium">{factor.display_label}</span>
                <span className="shrink-0 text-muted-foreground">
                  {factor.weight_pct.toFixed(1)}% ·{" "}
                  {factor.direction === "increases" ? t("impact.increases") : t("impact.decreases")}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-sm bg-muted">
                <div
                  className={
                    factor.direction === "increases"
                      ? "h-full bg-foreground/80"
                      : "h-full bg-foreground/40"
                  }
                  style={{ width: `${(factor.weight_pct / maxWeight) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">{t("impact.methodNote")}</p>
      </CardContent>
    </Card>
  );
}
