import { ModelsPageContent } from "@/components/models/models-page-content";
import {
  getCurrentModel,
  getModelEvaluation,
  getSimilarMatterEvidence,
  getStrategyComparison,
} from "@/lib/api/models";

export default async function ModelsPage() {
  const [current, evaluation, strategyComparison, similarMatterEvidence] = await Promise.all([
    getCurrentModel(),
    getModelEvaluation(),
    getStrategyComparison(),
    getSimilarMatterEvidence(),
  ]);

  return (
    <ModelsPageContent
      current={current}
      evaluation={evaluation}
      similarMatterEvidence={similarMatterEvidence}
      strategyComparison={strategyComparison}
    />
  );
}
