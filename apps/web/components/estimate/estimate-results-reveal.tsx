"use client";

import { useEffect, useState, type ReactNode } from "react";
import { consumeEstimateReveal } from "@/lib/estimate-processing";
import { cn } from "@/lib/utils";

type EstimateResultsRevealProps = {
  children: ReactNode;
  estimateId: string;
};

export function EstimateResultsReveal({ children, estimateId }: EstimateResultsRevealProps) {
  const [shouldReveal, setShouldReveal] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShouldReveal(consumeEstimateReveal(estimateId));
      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [estimateId]);

  if (!isReady) {
    return null;
  }

  return (
    <div
      className={cn(
        shouldReveal && "opacity-0 animate-fade-in",
      )}
    >
      {children}
    </div>
  );
}
