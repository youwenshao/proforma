"use client";

import { PlusCircle } from "lucide-react";
import { BackAction } from "@/components/back-action";
import { LocalizedLink } from "@/components/localized-link";
import { ModelEvidenceView } from "@/components/models/model-evidence-view";
import { Button } from "@/components/ui/button";
import type {
  ModelCurrent,
  ModelEvaluation,
  SimilarMatterEvidence,
  StrategyComparison,
} from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n/locale-context";

type ModelsPageContentProps = {
  current: ModelCurrent;
  evaluation: ModelEvaluation;
  similarMatterEvidence: SimilarMatterEvidence;
  strategyComparison: StrategyComparison;
};

export function ModelsPageContent({
  current,
  evaluation,
  similarMatterEvidence,
  strategyComparison,
}: ModelsPageContentProps) {
  const t = useTranslations();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/20 px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap gap-2">
          <BackAction href="/" label={t("nav.home")} />
          <Button asChild variant="outline">
            <LocalizedLink href="/estimate/new">
              <PlusCircle aria-hidden="true" />
              {t("nav.new")}
            </LocalizedLink>
          </Button>
        </div>
        <ModelEvidenceView
          current={current}
          evaluation={evaluation}
          similarMatterEvidence={similarMatterEvidence}
          strategyComparison={strategyComparison}
        />
      </div>
    </main>
  );
}
