"use client";

import { useMemo } from "react";
import { useTranslations } from "@/lib/i18n/locale-context";

export function ModelFlowDiagram() {
  const t = useTranslations();

  const steps = useMemo(
    () => [
      { label: t("charts.structuredFacts"), text: t("charts.structuredFactsText") },
      { label: t("charts.modelVersionStep"), text: t("charts.modelVersionText") },
      { label: t("charts.estimateRange"), text: t("charts.estimateRangeText") },
      { label: t("charts.partnerDecision"), text: t("charts.partnerDecisionText") },
    ],
    [t],
  );

  return (
    <ol className="grid gap-3 md:grid-cols-4">
      {steps.map((step, index) => (
        <li
          className="relative rounded-xl border border-border bg-muted/40 p-4 text-sm"
          key={step.label}
        >
          <span className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {index + 1}
          </span>
          <p className="font-medium">{step.label}</p>
          <p className="mt-2 text-muted-foreground">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
