"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/lib/i18n/locale-context";

type VarianceBadgeProps = {
  variancePct: number;
};

export function varianceStatus(variancePct: number) {
  const absoluteVariance = Math.abs(variancePct);
  if (absoluteVariance > 15) {
    return "Critical";
  }
  if (absoluteVariance > 5) {
    return "Warning";
  }
  return "On track";
}

export function VarianceBadge({ variancePct }: VarianceBadgeProps) {
  const t = useTranslations();
  const status = varianceStatus(variancePct);
  const variant = status === "Critical" ? "destructive" : "outline";

  const label =
    status === "Critical"
      ? t("common.critical")
      : status === "Warning"
        ? t("common.warning")
        : t("common.onTrack");

  return <Badge variant={variant}>{label}</Badge>;
}
