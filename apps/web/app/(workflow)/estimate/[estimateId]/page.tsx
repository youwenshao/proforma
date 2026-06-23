import { EstimatePageContent } from "@/components/estimate/estimate-page-content";
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
    <EstimatePageContent
      estimate={estimate}
      estimateId={estimateId}
      modelStrategy={modelStrategy}
      quoteSubstantiation={quoteSubstantiation}
    />
  );
}
