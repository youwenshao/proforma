import Link from "next/link";
import { ModelEvidenceView } from "@/components/models/model-evidence-view";
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
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl space-y-8">
        <Link className="text-sm text-muted-foreground underline-offset-4 hover:underline" href="/">
          Back to dashboard
        </Link>
        <ModelEvidenceView
          current={current}
          evaluation={evaluation}
          similarMatterEvidence={similarMatterEvidence}
          strategyComparison={strategyComparison}
        />
      </div>
    </main>
  );
}
