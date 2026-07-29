"use client";

import { useEffect, useRef } from "react";
import { pitchContent } from "./content";
import { addCountUp, gsap } from "./gsap";
import { useReducedMotion } from "./use-reduced-motion";

const { problem } = pitchContent;

function formatStat(stat: (typeof problem.stats)[number]) {
  return `${stat.prefix}${stat.value.toFixed(stat.decimals)}${stat.suffix}`;
}

export function ActProblem() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const stats = gsap.utils.toArray<HTMLElement>("[data-problem-stat]");
      const segments = gsap.utils.toArray<HTMLElement>("[data-problem-segment]");

      gsap.set(stats, { autoAlpha: 0, y: 90, filter: "blur(12px)" });
      gsap.set(segments, { scaleX: 0, transformOrigin: "left center" });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: true,
        },
      });

      stats.forEach((stat, index) => {
        const startAt = index * 3;
        const numberEl = stat.querySelector("[data-problem-number]");

        timeline.to(
          stat,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power2.out",
          },
          startAt,
        );
        if (numberEl) {
          const config = problem.stats[index];
          addCountUp(timeline, numberEl, config.value, {
            decimals: config.decimals,
            prefix: config.prefix,
            suffix: config.suffix,
            duration: 1.4,
            position: startAt + 0.15,
            useGrouping: false,
          });
        }
        timeline.to(
          segments[index],
          { scaleX: 1, duration: 3, ease: "none" },
          startAt,
        );
        if (index < stats.length - 1) {
          timeline.to(
            stat,
            {
              autoAlpha: 0,
              y: -90,
              filter: "blur(12px)",
              duration: 0.8,
              ease: "power2.in",
            },
            startAt + 2.2,
          );
        } else {
          // Hold the final stat on screen until the pin releases.
          timeline.to(stat, { autoAlpha: 1, duration: 0.8 }, startAt + 2.2);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="bg-background px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-4xl space-y-16">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary sm:text-sm">
            {problem.eyebrow}
          </p>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            {problem.framing}
          </p>
          {problem.stats.map((stat) => (
            <div className="space-y-4" key={stat.source}>
              <p className="text-6xl font-semibold tracking-tight text-primary sm:text-7xl">
                {formatStat(stat)}
              </p>
              <p className="max-w-2xl text-2xl font-medium leading-snug tracking-tight">
                {stat.heading}
              </p>
              <p className="text-sm text-muted-foreground">{stat.source}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-background" ref={sectionRef}>
      <div className="relative flex h-[100svh] flex-col overflow-hidden px-5 sm:px-8">
        <p className="pt-24 text-center text-xs font-medium uppercase tracking-[0.28em] text-primary sm:text-sm">
          {problem.eyebrow}
        </p>
        <p className="mx-auto mt-6 max-w-3xl text-balance px-2 text-center text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          {problem.framing}
        </p>

        <div className="relative flex-1">
          {problem.stats.map((stat) => (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              data-problem-stat
              key={stat.source}
            >
              <p
                className="text-7xl font-semibold tracking-tight text-primary sm:text-8xl lg:text-9xl"
                data-problem-number
              >
                {formatStat(stat)}
              </p>
              <p className="mt-8 max-w-3xl text-balance text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
                {stat.heading}
              </p>
              <p className="mt-6 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                {stat.source}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mb-14 flex w-full max-w-xs gap-2">
          {problem.stats.map((stat) => (
            <span
              className="h-1 flex-1 overflow-hidden rounded-full bg-border"
              key={stat.source}
            >
              <span className="block h-full w-full bg-primary" data-problem-segment />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
