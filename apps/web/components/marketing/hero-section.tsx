"use client";

import { LocalizedLink } from "@/components/localized-link";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/locale-context";
import { RandomAuroraBackground } from "./random-aurora-background";
import { ReportPreview } from "./report-preview";

export function HeroSection() {
  const t = useTranslations();

  return (
    <section className="relative isolate overflow-hidden bg-background px-5 pb-12 pt-8 sm:px-8 lg:px-10 lg:pb-16 lg:pt-10">
      <RandomAuroraBackground />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/40 to-transparent dark:from-background/70 dark:via-background/50 dark:to-transparent"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)] md:items-center">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
            {t("home.hero.eyebrow")}
          </p>
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl">
              {t("home.hero.title")}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              {t("home.hero.description")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <LocalizedLink href="/estimate/new">{t("home.hero.startEstimate")}</LocalizedLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <LocalizedLink href="/models">{t("home.hero.modelEvidence")}</LocalizedLink>
            </Button>
          </div>
          <Alert className="max-w-2xl border-white/20 bg-white/60 backdrop-blur-md dark:bg-card/60">
            <AlertTitle>{t("home.hero.syntheticAlertTitle")}</AlertTitle>
            <AlertDescription>{t("home.hero.syntheticAlertDescription")}</AlertDescription>
          </Alert>
        </div>
        <ReportPreview />
      </div>
    </section>
  );
}
