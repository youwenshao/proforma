"use client";

import { PlusCircle } from "lucide-react";
import { BackAction } from "@/components/back-action";
import { LocalizedLink } from "@/components/localized-link";
import { SavedResultsView } from "@/components/results/saved-results-view";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/locale-context";

export function ResultsPageContent() {
  const t = useTranslations();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/20 px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t("results.pageEyebrow")}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              {t("results.pageTitle")}
            </h1>
            <p className="text-muted-foreground">{t("results.pageDescription")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <LocalizedLink href="/estimate/new">
                <PlusCircle aria-hidden="true" />
                {t("nav.newEstimate")}
              </LocalizedLink>
            </Button>
            <BackAction href="/" label={t("nav.home")} />
          </div>
        </section>
        <SavedResultsView />
      </div>
    </main>
  );
}
