import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { BackAction } from "@/components/back-action";
import { ModelEvidenceView } from "@/components/models/model-evidence-view";
import { Button } from "@/components/ui/button";
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
    <main className="min-h-[calc(100vh-4rem)] bg-muted/20 px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap gap-2">
          <BackAction href="/" label="Home" />
          <Button asChild variant="outline">
            <Link href="/estimate/new">
              <PlusCircle aria-hidden="true" />
              New
            </Link>
          </Button>
        </div>
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
