"use client";

import { LocalizedLink } from "@/components/localized-link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n/locale-context";

export function HomeFeatureCards() {
  const t = useTranslations();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>{t("home.matterFacts.title")}</CardTitle>
          <CardDescription>{t("home.matterFacts.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>{t("home.matterFacts.body")}</p>
          <Button asChild variant="outline">
            <LocalizedLink href="/estimate/new">{t("home.matterFacts.cta")}</LocalizedLink>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("home.predictionResults.title")}</CardTitle>
          <CardDescription>{t("home.predictionResults.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>{t("home.predictionResults.body")}</p>
          <Button asChild variant="outline">
            <LocalizedLink href="/results">{t("home.predictionResults.cta")}</LocalizedLink>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("home.modelEvidence.title")}</CardTitle>
          <CardDescription>{t("home.modelEvidence.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>{t("home.modelEvidence.body")}</p>
          <Button asChild variant="outline">
            <LocalizedLink href="/models">{t("home.modelEvidence.cta")}</LocalizedLink>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
