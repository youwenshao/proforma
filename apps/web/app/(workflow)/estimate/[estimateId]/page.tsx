import Link from "next/link";
import { EstimateResultsView } from "@/components/estimate/estimate-results-view";
import { getEstimate, getQuoteSubstantiation } from "@/lib/api/estimates";
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
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl space-y-8">
        <Link className="text-sm text-muted-foreground underline-offset-4 hover:underline" href="/">
          Back to dashboard
        </Link>
        <EstimateResultsView
          estimate={estimate}
          modelStrategy={modelStrategy}
          quoteSubstantiation={quoteSubstantiation}
        />
      </div>
    </main>
  );
}
