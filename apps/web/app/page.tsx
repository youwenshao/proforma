import Link from "next/link";
import { Suspense } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-6 py-16">
        <Suspense fallback={null}>
          <LanguageSwitcher />
        </Suspense>

        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Feasibility-stage decision support
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            ProForma HK
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Bilingual matter scoping, predictive estimate review, fee
            recommendation, and scope-monitoring workflows for Hong Kong law
            firms.
          </p>
        </div>

        <Alert>
          <AlertTitle>Synthetic-data notice</AlertTitle>
          <AlertDescription>
            This frontend uses synthetic data from SYNTHETIC_MVP_V1 feasibility
            data and does not establish legal, regulatory, or production pricing
            approval. ProForma is decision-support software only; a partner or
            authorized solicitor makes every final fee decision.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Matter intake</CardTitle>
              <CardDescription>
                Capture bilingual matter parameters for pricing support review.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Matter type, jurisdiction, complexity, document volume, billing
              model, and risk tolerance.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Estimate review</CardTitle>
              <CardDescription>
                Present cost, duration, uncertainty, and fee recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              p10/p50/p90 intervals keep partner control explicit.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Scope monitoring</CardTitle>
              <CardDescription>
                Track stage variance and review actions during execution.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Feasibility mode disables confidential free-text notes by default.
            </CardContent>
          </Card>
        </div>

        <nav aria-label="Primary workflow actions" className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/estimate/new">Start estimate</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/models">Model evidence</Link>
          </Button>
        </nav>
      </section>
    </main>
  );
}
