"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type EstimateReferenceProps = {
  referenceId: string;
};

export function EstimateReference({ referenceId }: EstimateReferenceProps) {
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
      <span>Reference {referenceId}</span>
      <Button
        aria-label={copied ? "Reference code copied" : "Copy reference code"}
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
