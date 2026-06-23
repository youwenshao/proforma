import Link from "next/link";
import { Suspense } from "react";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { HeroSection } from "@/components/marketing/hero-section";
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
    <main className="min-h-[calc(100vh-4rem)] bg-muted/20 text-foreground">
      <HeroSection />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10">
        <Suspense fallback={null}>
          <DashboardOverview />
        </Suspense>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Matter facts</CardTitle>
              <CardDescription>Collect only structured facts needed for pricing review.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>Type, jurisdiction, complexity, parties, document volume, and billing model.</p>
              <Button asChild variant="outline">
                <Link href="/estimate/new">Start estimate</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Prediction results</CardTitle>
              <CardDescription>Compare low, typical, and high outcomes at a glance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>Saved predictions are available from the Results page after demo sign-in.</p>
              <Button asChild variant="outline">
                <Link href="/results">View saved results</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Model evidence</CardTitle>
              <CardDescription>See what model, dataset, and limitations sit underneath.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>Charts explain error patterns and legal gates without raw metric overload.</p>
              <Button asChild variant="outline">
                <Link href="/models">Model evidence</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
