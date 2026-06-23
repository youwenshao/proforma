import { Suspense } from "react";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { HeroSection } from "@/components/marketing/hero-section";
import { HomeFeatureCards } from "@/components/marketing/home-feature-cards";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/20 text-foreground">
      <HeroSection />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10">
        <Suspense fallback={null}>
          <DashboardOverview />
        </Suspense>

        <HomeFeatureCards />
      </section>
    </main>
  );
}
