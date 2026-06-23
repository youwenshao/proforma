"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/locale-context";

type EstimateReferenceProps = {
  referenceId: string;
};

export function EstimateReference({ referenceId }: EstimateReferenceProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referenceId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
      <span>{t("reference.label", { id: referenceId })}</span>
      <Button
        aria-label={copied ? t("reference.copied") : t("reference.copy")}
        className="text-muted-foreground"
        onClick={handleCopy}
        size="icon-xs"
        type="button"
        variant="ghost"
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </Button>
    </div>
  );
}
