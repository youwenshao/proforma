"use client";

import { LocalizedLink } from "@/components/localized-link";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/lib/i18n/locale-context";

const glassPanelClassName =
  "rounded-xl border border-white/20 bg-white/40 backdrop-blur-md dark:border-white/10 dark:bg-white/5";

export function ReportPreview() {
  const t = useTranslations();

  const rangeMetrics = [
    { label: t("summary.low"), value: "HK$410k" },
    { label: t("summary.typical"), value: "HK$566k" },
    { label: t("summary.high"), value: "HK$890k" },
  ];

  const evidenceItems = [
    t("preview.evidence1"),
    t("preview.evidence2"),
    t("preview.evidence3"),
  ];

  return (
    <aside
      aria-label={t("preview.generatedReport")}
      className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-white/50 p-5 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-card/50"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/20 pb-4 dark:border-white/10">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary">
            {t("preview.generatedReport")}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {t("preview.quotePack")}
          </h2>
        </div>
        <Badge
          className="border-white/30 bg-white/30 backdrop-blur-sm dark:border-white/10 dark:bg-white/10"
          variant="outline"
        >
          {t("preview.partnerDraft")}
        </Badge>
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-muted-foreground">{t("preview.matterSummary")}</p>
          <p className="font-medium">{t("preview.matterExample")}</p>
        </div>
        <span className="inline-flex items-center self-start rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium leading-none text-primary sm:self-center">
          {t("preview.comparableMatters")}
        </span>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
        {rangeMetrics.map((metric) => (
          <div key={metric.label} className={`${glassPanelClassName} p-3`}>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {metric.label}
            </p>
            <p className="mt-1 text-lg font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className={`mt-5 p-4 ${glassPanelClassName}`}>
        <p className="text-sm text-muted-foreground">{t("preview.recommendedFee")}</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight">HK$620k</p>
        <p className="mt-2 text-sm text-muted-foreground">{t("preview.feeDescription")}</p>
      </div>

      <div className="mt-5 space-y-2">
        {evidenceItems.map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60" aria-hidden="true" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-dashed border-white/30 bg-white/25 p-3 text-xs text-muted-foreground backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        {t("preview.footerNote")}
      </div>
    </aside>
  );
}
