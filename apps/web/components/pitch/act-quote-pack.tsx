"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { pitchContent } from "./content";
import { addCountUp, gsap } from "./gsap";
import { useReducedMotion } from "./use-reduced-motion";

const { quotePack } = pitchContent;
const { card } = quotePack;

const glassPanelClassName =
  "rounded-xl border border-white/20 bg-white/40 backdrop-blur-md dark:border-white/10 dark:bg-white/5";

/** Portion of the semicircular gauge swept at "medium" scope risk. */
const GAUGE_FILL = 0.55;

export function ActQuotePack() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const rangeBars = gsap.utils.toArray<HTMLElement>("[data-qp-bar]");
      const rangeValues = gsap.utils.toArray<HTMLElement>("[data-qp-range-value]");
      const feeValue = document.querySelector("[data-qp-fee-value]");

      gsap.set("[data-qp-heading]", { autoAlpha: 0, y: 40 });
      gsap.set("[data-qp-card]", {
        autoAlpha: 0,
        y: 180,
        scale: 0.72,
        rotationX: 42,
        rotationY: -16,
        transformPerspective: 1400,
      });
      gsap.set("[data-qp-header]", { autoAlpha: 0, y: 18 });
      gsap.set("[data-qp-matter]", { autoAlpha: 0, y: 18 });
      gsap.set("[data-qp-range]", { autoAlpha: 0, y: 24 });
      gsap.set(rangeBars, { scaleX: 0, transformOrigin: "left center" });
      gsap.set("[data-qp-fee]", { autoAlpha: 0, y: 24 });
      gsap.set("[data-qp-evidence]", { autoAlpha: 0, x: -24 });
      gsap.set("[data-qp-gauge]", { autoAlpha: 0 });
      gsap.set("[data-qp-gauge-arc]", { strokeDashoffset: 100 });
      gsap.set("[data-qp-gauge-needle]", {
        rotation: -90,
        transformOrigin: "50% 100%",
      });
      gsap.set("[data-qp-gauge-value]", { autoAlpha: 0 });
      gsap.set("[data-qp-footer]", { autoAlpha: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=350%",
          pin: true,
          scrub: true,
        },
      });

      timeline
        .to("[data-qp-heading]", { autoAlpha: 1, y: 0, duration: 0.8 }, 0)
        .to(
          "[data-qp-card]",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            rotationY: 0,
            duration: 1.6,
            ease: "power3.out",
          },
          0.6,
        )
        .to("[data-qp-header]", { autoAlpha: 1, y: 0, duration: 0.5 }, 2.0)
        .to("[data-qp-matter]", { autoAlpha: 1, y: 0, duration: 0.5 }, 2.3)
        .to(
          "[data-qp-range]",
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.25 },
          2.7,
        )
        .to(
          rangeBars,
          { scaleX: 1, duration: 0.7, stagger: 0.25, ease: "power1.inOut" },
          2.9,
        );

      rangeValues.forEach((el, index) => {
        addCountUp(timeline, el, card.ranges[index].value, {
          prefix: "HK$",
          suffix: "k",
          duration: 0.9,
          position: 2.9 + index * 0.25,
          useGrouping: false,
        });
      });

      timeline.to("[data-qp-fee]", { autoAlpha: 1, y: 0, duration: 0.6 }, 4.2);
      if (feeValue) {
        addCountUp(timeline, feeValue, card.feeValue, {
          prefix: "HK$",
          suffix: "k",
          duration: 1.1,
          position: 4.3,
          useGrouping: false,
        });
      }

      timeline
        .to(
          "[data-qp-evidence]",
          { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.2 },
          5.4,
        )
        .to("[data-qp-gauge]", { autoAlpha: 1, duration: 0.4 }, 6.0)
        .to(
          "[data-qp-gauge-arc]",
          { strokeDashoffset: 100 - GAUGE_FILL * 100, duration: 1, ease: "power1.inOut" },
          6.2,
        )
        .to(
          "[data-qp-gauge-needle]",
          { rotation: -90 + GAUGE_FILL * 180, duration: 1, ease: "power1.inOut" },
          6.2,
        )
        .to("[data-qp-gauge-value]", { autoAlpha: 1, duration: 0.4 }, 7.0)
        .to("[data-qp-footer]", { autoAlpha: 1, duration: 0.6 }, 7.4)
        // Breathing room so the finished pack holds on screen before unpin.
        .to("[data-qp-card]", { y: 0, duration: 1 }, 7.8);
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const inner = (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6">
      <div className="max-w-3xl text-center" data-qp-heading>
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
          {quotePack.eyebrow}
        </p>
        <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
          {quotePack.heading}
        </h2>
        <p className="mt-3 text-balance text-sm leading-6 text-muted-foreground sm:text-base">
          {quotePack.subheading}
        </p>
      </div>

      <div style={{ perspective: "1400px" }}>
        <div
          className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-white/50 p-4 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-card/50 sm:p-5"
          data-qp-card
        >
          <div
            className="flex flex-wrap items-start justify-between gap-3 border-b border-white/20 pb-4 dark:border-white/10"
            data-qp-header
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary">
                {card.reportLabel}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">{card.title}</p>
            </div>
            <Badge
              className="border-white/30 bg-white/30 backdrop-blur-sm dark:border-white/10 dark:bg-white/10"
              variant="outline"
            >
              {card.badge}
            </Badge>
          </div>

          <div
            className="mt-4 grid gap-3 text-sm sm:grid-cols-[1fr_auto] sm:items-center"
            data-qp-matter
          >
            <div>
              <p className="text-muted-foreground">{card.matterLabel}</p>
              <p className="font-medium">{card.matterValue}</p>
            </div>
            <span className="inline-flex items-center self-start rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium leading-none text-primary sm:self-center">
              {card.comparables}
            </span>
          </div>

          <p className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {card.rangesHeading}
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2.5">
            {card.ranges.map((range) => (
              <div className={`${glassPanelClassName} p-2.5 sm:p-3`} data-qp-range key={range.label}>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:text-xs">
                  {range.label}
                </p>
                <p className="mt-1 text-sm font-semibold sm:text-lg" data-qp-range-value>
                  {range.display}
                </p>
                <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-primary/15">
                  <span
                    className="block h-full rounded-full bg-primary"
                    data-qp-bar
                    style={{ width: `${range.fill * 100}%` }}
                  />
                </span>
              </div>
            ))}
          </div>

          <div className={`mt-5 grid grid-cols-[1fr_auto] items-center gap-4 p-4 ${glassPanelClassName}`}>
            <div data-qp-fee>
              <p className="text-sm text-muted-foreground">{card.feeLabel}</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight" data-qp-fee-value>
                HK${card.feeValue}k
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{card.feeDescription}</p>
            </div>
            <div className="flex flex-col items-center justify-center" data-qp-gauge>
              <svg
                aria-hidden="true"
                className="h-14 w-24"
                fill="none"
                viewBox="0 0 120 64"
              >
                <path
                  className="stroke-border"
                  d="M 12 60 A 48 48 0 0 1 108 60"
                  strokeLinecap="round"
                  strokeWidth="8"
                />
                <path
                  className="stroke-primary"
                  d="M 12 60 A 48 48 0 0 1 108 60"
                  data-qp-gauge-arc
                  pathLength={100}
                  strokeDasharray={100}
                  strokeDashoffset={100 - GAUGE_FILL * 100}
                  strokeLinecap="round"
                  strokeWidth="8"
                />
                <line
                  className="stroke-foreground"
                  data-qp-gauge-needle
                  strokeLinecap="round"
                  strokeWidth="3"
                  x1="60"
                  x2="60"
                  y1="60"
                  y2="24"
                />
              </svg>
              <p
                className="mt-2 text-center text-xs uppercase tracking-[0.16em] text-muted-foreground"
                data-qp-gauge-value
              >
                {card.gaugeLabel}
                <span className="mt-0.5 block text-sm font-semibold normal-case tracking-normal text-foreground">
                  {card.gaugeValue}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {card.evidence.map((item) => (
              <div className="flex items-center gap-2 text-sm" data-qp-evidence key={item}>
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div
            className="mt-5 rounded-lg border border-dashed border-white/30 bg-white/25 p-3 text-xs text-muted-foreground backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
            data-qp-footer
          >
            {card.footerNote}
          </div>
        </div>
      </div>
    </div>
  );

  if (reducedMotion) {
    return (
      <section className="bg-background px-5 py-24 sm:px-8">{inner}</section>
    );
  }

  return (
    <section className="relative bg-background" ref={sectionRef}>
      <div className="flex min-h-[100svh] items-center overflow-hidden px-5 pb-8 pt-20 sm:px-8">
        {inner}
      </div>
    </section>
  );
}
