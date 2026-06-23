"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PROCESSING_STATUS_MESSAGE_KEYS } from "@/lib/estimate-processing";
import { useTranslations } from "@/lib/i18n/locale-context";

export function EstimateProcessingOverlay() {
  const t = useTranslations();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % PROCESSING_STATUS_MESSAGE_KEYS.length);
    }, 1200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      role="status"
    >
      <div className="flex max-w-md flex-col items-center gap-4 px-6 text-center">
        <Loader2 aria-hidden="true" className="size-10 animate-spin text-primary" />
        <div className="space-y-2">
          <p className="text-lg font-medium">{t("estimate.processingTitle")}</p>
          <p className="text-sm text-muted-foreground">
            {t(PROCESSING_STATUS_MESSAGE_KEYS[messageIndex])}
          </p>
        </div>
      </div>
    </div>
  );
}
