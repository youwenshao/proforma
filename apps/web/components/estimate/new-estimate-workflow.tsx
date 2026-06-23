"use client";

import { useState } from "react";
import { BackAction } from "@/components/back-action";
import { MatterIntakeForm } from "@/components/estimate/matter-intake-form";
import { EstimateProcessingOverlay } from "@/components/estimate/estimate-processing-overlay";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Taxonomy } from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

type ProcessingPhase = "idle" | "dissolving" | "processing";

type NewEstimateWorkflowProps = {
  taxonomy: Taxonomy;
};

export function NewEstimateWorkflow({ taxonomy }: NewEstimateWorkflowProps) {
  const t = useTranslations();
  const [phase, setPhase] = useState<ProcessingPhase>("idle");

  function handleProcessingStart() {
    setPhase("dissolving");
  }

  function handleDissolveComplete() {
    setPhase("processing");
  }

  function handleProcessingEnd() {
    setPhase("idle");
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/20 px-6 py-10 text-foreground">
      <div className="mx-auto max-w-5xl space-y-8">
        <div
          className={cn(
            "space-y-8",
            (phase === "dissolving" || phase === "processing") && "animate-dissolve-out",
          )}
        >
          <BackAction href="/" label={t("nav.home")} />
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t("estimate.matterIntake")}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              {t("estimate.describeMatter")}
            </h1>
            <p className="max-w-3xl text-muted-foreground">{t("estimate.describeMatterBody")}</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t("estimate.structuredFacts")}</CardTitle>
            </CardHeader>
            <CardContent>
              <MatterIntakeForm
                onDissolveComplete={handleDissolveComplete}
                onProcessingEnd={handleProcessingEnd}
                onProcessingStart={handleProcessingStart}
                taxonomy={taxonomy}
              />
            </CardContent>
          </Card>
          <Alert>
            <AlertTitle>{t("estimate.decisionSupportOnly")}</AlertTitle>
            <AlertDescription>{t("estimate.decisionSupportBody")}</AlertDescription>
          </Alert>
        </div>
      </div>
      {phase === "processing" ? <EstimateProcessingOverlay /> : null}
    </main>
  );
}
