import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { BackAction } from "@/components/back-action";
import { SavedResultsView } from "@/components/results/saved-results-view";
import { Button } from "@/components/ui/button";

export default function ResultsPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/20 px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Saved prediction results
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Revisit estimates from this browser.
            </h1>
            <p className="text-muted-foreground">
              Demo history keeps the full prediction response locally, so people can return to
              previous results without remembering an estimate ID.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/estimate/new">
                <PlusCircle aria-hidden="true" />
                New estimate
              </Link>
            </Button>
            <BackAction href="/" label="Home" />
          </div>
        </section>
        <SavedResultsView />
      </div>
    </main>
  );
}
