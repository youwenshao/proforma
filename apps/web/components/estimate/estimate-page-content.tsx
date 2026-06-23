"use client";

import { History } from "lucide-react";
import { BackAction } from "@/components/back-action";
import { LocalizedLink } from "@/components/localized-link";
import { EstimateResultsReveal } from "@/components/estimate/estimate-results-reveal";
import { EstimateResultsView } from "@/components/estimate/estimate-results-view";
import { Button } from "@/components/ui/button";
import type { EstimateResponse, ModelStrategy, QuoteSubstantiation } from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n/locale-context";

type EstimatePageContentProps = {
  estimate: EstimateResponse | null;
  estimateId: string;
  modelStrategy: ModelStrategy;
  quoteSubstantiation: QuoteSubstantiation | null;
};

export function EstimatePageContent({
  estimate,
  estimateId,
  modelStrategy,
  quoteSubstantiation,
}: EstimatePageContentProps) {
  const t = useTranslations();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/20 px-6 py-10 text-foreground">
      <EstimateResultsReveal estimateId={estimateId}>
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-wrap gap-2">
            <BackAction href="/" label={t("nav.home")} />
            <Button asChild variant="outline">
              <LocalizedLink href="/results">
                <History aria-hidden="true" />
                {t("dashboard.viewSavedResults")}
              </LocalizedLink>
            </Button>
          </div>
          <EstimateResultsView
            estimate={estimate}
            modelStrategy={modelStrategy}
            quoteSubstantiation={quoteSubstantiation}
          />
        </div>
      </EstimateResultsReveal>
    </main>
  );
}
