"use client";

import type { ModelCurrent } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n/locale-context";

type ModelCurrentCardProps = {
  current: ModelCurrent;
};

export function ModelCurrentCard({ current }: ModelCurrentCardProps) {
  const t = useTranslations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("models.currentModel")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge>{current.status}</Badge>
          {current.synthetic_data ? (
            <Badge variant="outline">{t("models.syntheticData")}</Badge>
          ) : null}
        </div>
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
      </CardContent>
    </Card>
  );
}
