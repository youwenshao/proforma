"use client";

import type { ModelArtifactIndex, ModelCurrent } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "@/lib/i18n/locale-context";
import { EvidenceCardTitle } from "./evidence-card-title";
import { ModelArtifacts } from "./model-artifacts";

type ModelCurrentCardProps = {
  artifactIndex: ModelArtifactIndex;
  current: ModelCurrent;
};

export function ModelCurrentCard({ artifactIndex, current }: ModelCurrentCardProps) {
  const t = useTranslations();

  return (
    <Card>
      <CardHeader>
        <EvidenceCardTitle>{t("models.currentModel")}</EvidenceCardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge>{current.status}</Badge>
          {current.synthetic_data ? (
            <Badge variant="outline">{t("models.syntheticData")}</Badge>
          ) : null}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <p className="font-medium">{t("models.whatModelIs")}</p>
            <p className="mt-1 text-muted-foreground">
              {t("models.whatModelIsBody", { version: current.model_version })}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <p className="font-medium">{t("models.modelInputs")}</p>
            <p className="mt-1 text-muted-foreground">{t("models.modelInputsBody")}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <p className="font-medium">{t("models.modelExclusions")}</p>
            <p className="mt-1 text-muted-foreground">{t("models.modelExclusionsBody")}</p>
          </div>
        </div>

        <div>
          <dl className="grid gap-3 md:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">{t("models.modelVersion")}</dt>
              <dd className="font-medium">{current.model_version}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("models.featureVersion")}</dt>
              <dd className="font-medium">{current.feature_version}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("models.datasetLineage")}</dt>
              <dd className="font-medium">{current.dataset_lineage.dataset_id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("models.sourceMarker")}</dt>
              <dd className="font-medium">{current.dataset_lineage.source_marker}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">{t("models.versionsExplainer")}</p>
        </div>

        <Separator />

        <ModelArtifacts artifactIndex={artifactIndex} />
      </CardContent>
    </Card>
  );
}
