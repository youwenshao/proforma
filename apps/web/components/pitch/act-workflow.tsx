"use client";

import { useEffect, useRef } from "react";
import { pitchContent } from "./content";
import { gsap } from "./gsap";
import { useReducedMotion } from "./use-reduced-motion";

const { workflow } = pitchContent;

function WorkflowPanel({
  step,
  className,
}: {
  step: (typeof workflow.steps)[number];
  className?: string;
}) {
  return (
    <article
      className={`rounded-2xl border border-white/20 bg-white/45 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-card/50 sm:p-8 ${className ?? ""}`}
    >
      <p className="font-mono text-sm text-primary">{step.index}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
        {step.title}
      </h3>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        {step.description}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {step.chips.map((chip) => (
          <span
            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            key={chip}
          >
            {chip}
          </span>
        ))}
      </div>
    </article>
  );
}

export function ActWorkflow() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const matchMedia = gsap.matchMedia();

      // Desktop gets the pinned horizontal strip; below md the strip is a
      // native swipeable snap carousel and needs no ScrollTrigger.
      matchMedia.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        if (!track) {
          return;
        }

        const distance = () =>
          Math.max(0, track.scrollWidth - document.documentElement.clientWidth);

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        gsap.to("[data-workflow-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="bg-background px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary sm:text-sm">
            {workflow.eyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            {workflow.heading}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {workflow.steps.map((step) => (
              <WorkflowPanel key={step.index} step={step} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-background" ref={sectionRef}>
      <div className="flex flex-col justify-center gap-10 px-5 py-24 sm:px-8 md:h-[100svh] md:py-0">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary sm:text-sm">
            {workflow.eyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            {workflow.heading}
          </h2>
        </div>

        <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 md:mx-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          <div
            className="flex w-max snap-x snap-mandatory gap-5 md:snap-none md:pl-[max(1.25rem,calc((100vw-72rem)/2))] md:pr-[40vw]"
            ref={trackRef}
          >
            {workflow.steps.map((step) => (
              <WorkflowPanel
                className="w-[85vw] max-w-md shrink-0 snap-center md:w-[36rem] md:max-w-none"
                key={step.index}
                step={step}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto hidden w-full max-w-6xl md:block">
          <span className="block h-1 w-56 overflow-hidden rounded-full bg-border">
            <span
              className="block h-full w-full origin-left scale-x-0 bg-primary"
              data-workflow-progress
            />
          </span>
        </div>
      </div>
    </section>
  );
}
