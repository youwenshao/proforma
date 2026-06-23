"use client";

import type { SimilarMatterEvidence } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n/locale-context";

type SimilarMatterEvidenceCardProps = {
  evidence: SimilarMatterEvidence;
};

export function SimilarMatterEvidenceCard({ evidence }: SimilarMatterEvidenceCardProps) {
  const t = useTranslations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("models.similarMatter")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{evidence.status}</Badge>
          <Badge variant="outline">{evidence.legal_gate_status}</Badge>
          <Badge variant="outline">
            {evidence.retrieval_enabled
              ? t("models.retrievalEnabled")
              : t("models.retrievalDisabled")}
          </Badge>
        </div>
        <p className="text-muted-foreground">{evidence.description}</p>
        <dl className="grid gap-3 md:grid-cols-2">
          <div>
            <dt className="font-medium">{t("models.allowedInputs")}</dt>
            <dd className="text-muted-foreground">{evidence.allowed_inputs.join(", ")}</dd>
          </div>
          <div>
            <dt className="font-medium">{t("models.excludedInputs")}</dt>
            <dd className="text-muted-foreground">{evidence.excluded_inputs.join(", ")}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
