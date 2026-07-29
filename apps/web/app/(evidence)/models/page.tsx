import { ModelsPageContent } from "@/components/models/models-page-content";
import {
  getCurrentModel,
  getModelArtifacts,
  getModelEvaluation,
  getSimilarMatterEvidence,
  getStrategyComparison,
} from "@/lib/api/models";

export default async function ModelsPage() {
  const [current, evaluation, strategyComparison, similarMatterEvidence, artifactIndex] =
    await Promise.all([
      getCurrentModel(),
      getModelEvaluation(),
      getStrategyComparison(),
      getSimilarMatterEvidence(),
      getModelArtifacts(),
    ]);

  return (
    <ModelsPageContent
      artifactIndex={artifactIndex}
      current={current}
      evaluation={evaluation}
      similarMatterEvidence={similarMatterEvidence}
      strategyComparison={strategyComparison}
    />
  );
}
