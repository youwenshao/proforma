"use client";

import { Download } from "lucide-react";
import { getApiBaseUrl } from "@/lib/api/client";
import { Button } from "@/components/ui/button";

type QuotePackActionsProps = {
  estimateId: string;
};

export function QuotePackActions({ estimateId }: QuotePackActionsProps) {
  const pdfUrl = `${getApiBaseUrl()}/v1/estimates/${estimateId}/quote-substantiation.pdf`;

  return (
    <Button asChild variant="outline" size="sm">
      <a href={pdfUrl} download={`quote-substantiation-${estimateId}.pdf`}>
        <Download aria-hidden="true" />
        Download PDF
      </a>
    </Button>
  );
}
