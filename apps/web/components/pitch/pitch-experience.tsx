"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { useReducedMotion } from "./use-reduced-motion";
import { ActTitle } from "./act-title";
import { ActProblem } from "./act-problem";
import { ActStatement } from "./act-statement";
import { ActQuotePack } from "./act-quote-pack";
import { ActWorkflow } from "./act-workflow";
import { ActEvidence } from "./act-evidence";
import { ActAsk } from "./act-ask";

export function PitchExperience() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const lenis = new Lenis({ autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    // Exposed so e2e tooling can drive the smooth scroller programmatically.
    const globalWindow = window as unknown as { lenis?: Lenis };
    globalWindow.lenis = lenis;

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      delete globalWindow.lenis;
    };
  }, [reducedMotion]);

  return (
    <main className="overflow-x-clip bg-background text-foreground">
      <ActTitle />
      <ActProblem />
      <ActStatement />
      <ActQuotePack />
      <ActWorkflow />
      <ActEvidence />
      <ActAsk />
    </main>
  );
}
