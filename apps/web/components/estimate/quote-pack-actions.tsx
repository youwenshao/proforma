"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/locale-context";

type QuotePackActionsProps = {
  estimateId: string;
};

export function QuotePackActions({ estimateId }: QuotePackActionsProps) {
  const t = useTranslations();
  const pdfUrl = `/v1/estimates/${estimateId}/quote-substantiation.pdf`;

  return (
    <Button asChild variant="outline" size="sm">
      <a href={pdfUrl} download={`quote-substantiation-${estimateId}.pdf`}>
        <Download aria-hidden="true" />
        {t("quote.downloadPdf")}
      </a>
    </Button>
  );
}
