import Link from "next/link";
import { History } from "lucide-react";
import { BackAction } from "@/components/back-action";
import { EstimateResultsReveal } from "@/components/estimate/estimate-results-reveal";
import { EstimateResultsView } from "@/components/estimate/estimate-results-view";
import { getEstimate, getQuoteSubstantiation } from "@/lib/api/estimates";
import { Button } from "@/components/ui/button";
import type { ModelStrategy } from "@/lib/api/types";

type EstimatePageProps = {
  params: Promise<{ estimateId: string }>;
  searchParams: Promise<{ modelStrategy?: ModelStrategy }>;
};

export default async function EstimatePage({ params, searchParams }: EstimatePageProps) {
  const [{ estimateId }, { modelStrategy = "synthetic_baseline" }] = await Promise.all([
    params,
    searchParams,
  ]);
  const estimate = await getEstimate(estimateId);
  const quoteSubstantiation = estimate ? await getQuoteSubstantiation(estimateId) : null;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/20 px-6 py-10 text-foreground">
      <EstimateResultsReveal estimateId={estimateId}>
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-wrap gap-2">
            <BackAction href="/" label="Home" />
            <Button asChild variant="outline">
              <Link href="/results">
                <History aria-hidden="true" />
                View saved results
              </Link>
            </Button>
          </div>
          <EstimateResultsView
            estimate={estimate}
            modelStrategy={modelStrategy}
            quoteSubstantiation={quoteSubstantiation}
          />
        </div>
      </EstimateResultsReveal>
    </main>
  );
}
