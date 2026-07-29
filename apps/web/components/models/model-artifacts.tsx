"use client";

import { Download, Eye } from "lucide-react";
import type {
  ModelArtifact,
  ModelArtifactCategory,
  ModelArtifactIndex,
} from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/locale-context";
import type { TranslationKey } from "@/lib/i18n/en";

type ModelArtifactsProps = {
  artifactIndex: ModelArtifactIndex;
};

type ArtifactCopy = {
  titleKey: TranslationKey;
  summaryKey: TranslationKey;
};

const artifactCopy: Record<string, ArtifactCopy> = {
  "synthetic-dataset": {
    titleKey: "models.artifact.syntheticDataset",
    summaryKey: "models.artifact.syntheticDatasetSummary",
  },
  "dataset-generator": {
    titleKey: "models.artifact.datasetGenerator",
    summaryKey: "models.artifact.datasetGeneratorSummary",
  },
  "data-dictionary": {
    titleKey: "models.artifact.dataDictionary",
    summaryKey: "models.artifact.dataDictionarySummary",
  },
  "validation-report": {
    titleKey: "models.artifact.validationReport",
    summaryKey: "models.artifact.validationReportSummary",
  },
  "dataset-lineage": {
    titleKey: "models.artifact.datasetLineage",
    summaryKey: "models.artifact.datasetLineageSummary",
  },
  "model-card-cost": {
    titleKey: "models.artifact.modelCardCost",
    summaryKey: "models.artifact.modelCardCostSummary",
  },
  "model-card-scope-creep": {
    titleKey: "models.artifact.modelCardScopeCreep",
    summaryKey: "models.artifact.modelCardScopeCreepSummary",
  },
  "training-report-cost": {
    titleKey: "models.artifact.trainingReportCost",
    summaryKey: "models.artifact.trainingReportCostSummary",
  },
  "strategy-comparison-report": {
    titleKey: "models.artifact.strategyComparisonReport",
    summaryKey: "models.artifact.strategyComparisonReportSummary",
  },
  "model-bundle-total-cost": {
    titleKey: "models.artifact.bundleTotalCost",
    summaryKey: "models.artifact.bundleTotalCostSummary",
  },
  "model-bundle-duration": {
    titleKey: "models.artifact.bundleDuration",
    summaryKey: "models.artifact.bundleDurationSummary",
  },
  "model-bundle-partner-hours": {
    titleKey: "models.artifact.bundlePartnerHours",
    summaryKey: "models.artifact.bundlePartnerHoursSummary",
  },
  "model-bundle-associate-hours": {
    titleKey: "models.artifact.bundleAssociateHours",
    summaryKey: "models.artifact.bundleAssociateHoursSummary",
  },
  "model-bundle-scope-creep": {
    titleKey: "models.artifact.bundleScopeCreep",
    summaryKey: "models.artifact.bundleScopeCreepSummary",
  },
};

const categoryOrder: Array<{ category: ModelArtifactCategory; headingKey: TranslationKey }> = [
  { category: "dataset", headingKey: "models.artifactsDataset" },
  { category: "model", headingKey: "models.artifactsModel" },
  { category: "report", headingKey: "models.artifactsReport" },
];

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ModelArtifacts({ artifactIndex }: ModelArtifactsProps) {
  const t = useTranslations();
  const artifacts = artifactIndex.artifacts ?? [];

  if (artifacts.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("models.artifactsUnavailable")}</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="font-medium">{t("models.artifacts")}</p>
        <p className="mt-1 text-muted-foreground">{t("models.artifactsBody")}</p>
      </div>
      {categoryOrder.map(({ category, headingKey }) => {
        const group = artifacts.filter((artifact) => artifact.category === category);

        if (group.length === 0) {
          return null;
        }

        const showRebuildNote =
          category === "model" && group.some((artifact) => !artifact.available);

        return (
          <section key={category} className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {t(headingKey)}
            </h3>
            {showRebuildNote ? (
              <p className="text-xs text-muted-foreground">{t("models.artifactsRebuildNote")}</p>
            ) : null}
            <ul className="space-y-2">
              {group.map((artifact) => (
                <ArtifactRow artifact={artifact} key={artifact.artifact_id} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function ArtifactRow({ artifact }: { artifact: ModelArtifact }) {
  const t = useTranslations();
  const copy = artifactCopy[artifact.artifact_id];
  const title = copy ? t(copy.titleKey) : artifact.filename;

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="font-medium">{title}</p>
        {copy ? <p className="mt-1 text-muted-foreground">{t(copy.summaryKey)}</p> : null}
        <p className="mt-1 font-mono text-xs break-all text-muted-foreground">
          {artifact.filename}
          {artifact.size_bytes !== null ? ` · ${formatFileSize(artifact.size_bytes)}` : null}
        </p>
        {artifact.available ? null : (
          <p className="mt-1 text-xs text-muted-foreground">
            {t("models.artifactUnavailable")} ·{" "}
            <span className="font-mono break-all">
              {t("models.artifactRebuild", { command: artifact.rebuild_command })}
            </span>
          </p>
        )}
      </div>
      {artifact.available ? (
        <div className="flex shrink-0 gap-2">
          {artifact.view_path ? (
            <Button asChild size="sm" variant="ghost">
              <a
                aria-label={t("models.artifactViewLabel", { name: title })}
                href={artifact.view_path}
                rel="noreferrer"
                target="_blank"
              >
                <Eye aria-hidden="true" />
                {t("models.artifactView")}
              </a>
            </Button>
          ) : null}
          <Button asChild size="sm" variant="outline">
            <a
              aria-label={t("models.artifactDownloadLabel", { name: title })}
              download={artifact.filename}
              href={artifact.download_path}
            >
              <Download aria-hidden="true" />
              {t("models.artifactDownload")}
            </a>
          </Button>
        </div>
      ) : null}
    </li>
  );
}
