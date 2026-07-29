"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n/locale-context";
import type { TranslationKey } from "@/lib/i18n/en";
import { EvidenceCardTitle } from "./evidence-card-title";

const glossaryEntries: Array<{ termKey: TranslationKey; definitionKey: TranslationKey }> = [
  { termKey: "models.glossaryScopeCreep", definitionKey: "models.glossaryScopeCreepBody" },
  { termKey: "models.glossaryModel", definitionKey: "models.glossaryModelBody" },
  { termKey: "models.glossaryRange", definitionKey: "models.glossaryRangeBody" },
  { termKey: "models.glossaryError", definitionKey: "models.glossaryErrorBody" },
  { termKey: "models.glossarySynthetic", definitionKey: "models.glossarySyntheticBody" },
];

export function EvidenceGlossary() {
  const t = useTranslations();

  return (
    <Card>
      <CardHeader>
        <EvidenceCardTitle>{t("models.glossary")}</EvidenceCardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 text-sm md:grid-cols-2">
          {glossaryEntries.map((entry) => (
            <div className="rounded-lg border border-border p-3" key={entry.termKey}>
              <dt className="font-medium">{t(entry.termKey)}</dt>
              <dd className="mt-1 text-muted-foreground">{t(entry.definitionKey)}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
