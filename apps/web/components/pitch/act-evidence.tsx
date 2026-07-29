"use client";

import { useEffect, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { pitchContent } from "./content";
import { EvidenceRealChart } from "./evidence-real-chart";
import { addCountUp, gsap } from "./gsap";
import { useReducedMotion } from "./use-reduced-motion";

const { evidence } = pitchContent;
const { chart: evidenceChart } = evidence;

/** Illustrative right-skewed distribution; marker x-positions are chosen to match headline rates. */
const CURVE_PATH =
  "M 20 208 C 90 205 120 60 200 52 C 280 44 320 150 400 178 C 460 199 540 206 580 208";
const CHART_BASELINE_Y = 208;
const AREA_PATH = `${CURVE_PATH} L 580 ${CHART_BASELINE_Y} L 20 ${CHART_BASELINE_Y} Z`;
const ANY_OVERRUN_X = 228;
const MATERIAL_CREEP_X = 300;
const anyOverrunStat = evidence.stats[2];
const materialCreepStat = evidence.stats[1];

function formatStat(stat: (typeof evidence.stats)[number]) {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: stat.decimals,
    maximumFractionDigits: stat.decimals,
  }).format(stat.value)}${stat.suffix}`;
}

export function ActEvidence() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const statCards = gsap.utils.toArray<HTMLElement>("[data-evidence-stat]");
      const statValues = gsap.utils.toArray<HTMLElement>("[data-evidence-value]");

      gsap.from("[data-evidence-heading]", {
        autoAlpha: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      const statsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-evidence-stats]",
          start: "top 85%",
          end: "top 35%",
          scrub: true,
        },
      });
      statCards.forEach((cardEl, index) => {
        const config = evidence.stats[index];
        statsTimeline.fromTo(
          cardEl,
          { autoAlpha: 0, y: 50 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
          index * 0.5,
        );
        addCountUp(statsTimeline, statValues[index], config.value, {
          decimals: config.decimals,
          suffix: config.suffix,
          duration: 1,
          position: index * 0.5 + 0.1,
        });
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "[data-evidence-chart]",
            start: "top 85%",
            end: "top 25%",
            scrub: true,
          },
        })
        .fromTo(
          "[data-evidence-chart]",
          { autoAlpha: 0, y: 60 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
          0,
        )
        .fromTo(
          "[data-evidence-curve]",
          { strokeDashoffset: 1000 },
          { strokeDashoffset: 0, duration: 2, ease: "none" },
          0.3,
        )
        .fromTo(
          "[data-evidence-area]",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8 },
          1.6,
        )
        .fromTo(
          "[data-evidence-marker]",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.3 },
          1.9,
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "[data-evidence-real-chart]",
            start: "top 85%",
            end: "top 30%",
            scrub: true,
          },
        })
        .fromTo(
          "[data-evidence-real-chart]",
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0,
        )
        .fromTo(
          "[data-evidence-real-bar]",
          { scaleY: 0, transformOrigin: "center bottom" },
          { scaleY: 1, duration: 1.4, ease: "power2.out", stagger: 0.02 },
          0.2,
        );

      gsap.from("[data-evidence-disclaimer]", {
        autoAlpha: 0,
        y: 24,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-evidence-disclaimer]",
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="bg-background px-5 py-24 sm:px-8 lg:py-32" ref={sectionRef}>
      <div className="mx-auto max-w-6xl">
        <div data-evidence-heading>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary sm:text-sm">
            {evidence.eyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            {evidence.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {evidence.subheading}
          </p>
          <p className="mt-4 max-w-3xl rounded-xl border border-white/20 bg-white/35 p-4 text-sm leading-6 text-muted-foreground backdrop-blur-sm dark:border-white/10 dark:bg-card/40 sm:text-base sm:leading-7">
            {evidence.leadDefinition}
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3" data-evidence-stats>
          {evidence.stats.map((stat) => (
            <div
              className="rounded-2xl border border-white/20 bg-white/45 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-card/50"
              data-evidence-stat
              key={stat.label}
            >
              <p
                className="text-4xl font-semibold tracking-tight text-primary sm:text-5xl"
                data-evidence-value
              >
                {formatStat(stat)}
              </p>
              <p className="mt-3 text-base font-medium">{stat.label}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.detail}</p>
            </div>
          ))}
        </div>

        <div
          className="mt-8 rounded-2xl border border-white/20 bg-white/45 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-card/50 sm:p-8"
          data-evidence-chart
        >
          <figure>
            <figcaption>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">{evidenceChart.title}</p>
                <Badge variant="outline">{evidenceChart.badge}</Badge>
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                {evidenceChart.caption}
              </p>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground/80">
                {evidenceChart.relationship}
              </p>
            </figcaption>

            <svg
              aria-labelledby="evidence-chart-title evidence-chart-desc"
              className="mt-5 w-full"
              fill="none"
              role="img"
              viewBox="0 0 620 300"
            >
              <title id="evidence-chart-title">{evidenceChart.title}</title>
              <desc id="evidence-chart-desc">
                {evidenceChart.caption} {evidenceChart.relationship}{" "}
                {formatStat(anyOverrunStat)} {evidenceChart.markers.anyOverrun.label}.{" "}
                {formatStat(materialCreepStat)} {evidenceChart.markers.materialCreep.label}.
              </desc>

              <defs>
                <linearGradient id="evidence-area-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity="0.28"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
                    stopOpacity="0.02"
                  />
                </linearGradient>
                <clipPath id="evidence-tail-broad">
                  <rect height="240" width={580 - ANY_OVERRUN_X} x={ANY_OVERRUN_X} y="0" />
                </clipPath>
                <clipPath id="evidence-tail-strict">
                  <rect height="240" width={580 - MATERIAL_CREEP_X} x={MATERIAL_CREEP_X} y="0" />
                </clipPath>
              </defs>

              <text
                className="fill-muted-foreground text-[11px]"
                textAnchor="middle"
                transform="rotate(-90 14 118)"
                x="14"
                y="118"
              >
                {evidenceChart.axes.y}
              </text>

              <line
                className="stroke-border"
                strokeWidth="1.5"
                x1="20"
                x2="580"
                y1={CHART_BASELINE_Y}
                y2={CHART_BASELINE_Y}
              />

              <path
                clipPath="url(#evidence-tail-broad)"
                d={AREA_PATH}
                fill="var(--primary)"
                fillOpacity="0.08"
              />
              <path
                clipPath="url(#evidence-tail-strict)"
                d={AREA_PATH}
                fill="var(--primary)"
                fillOpacity="0.16"
              />

              <path
                d={AREA_PATH}
                data-evidence-area
                fill="url(#evidence-area-fill)"
              />
              <path
                className="stroke-primary"
                d={CURVE_PATH}
                data-evidence-curve
                pathLength={1000}
                strokeDasharray={1000}
                strokeLinecap="round"
                strokeWidth="3.5"
              />

              <text
                className="fill-muted-foreground text-[11px]"
                textAnchor="start"
                x="20"
                y="224"
              >
                {evidenceChart.axes.xLeft}
              </text>
              <text
                className="fill-muted-foreground text-[11px] font-medium"
                textAnchor="middle"
                x="300"
                y="242"
              >
                {evidenceChart.axes.x}
              </text>
              <text
                className="fill-muted-foreground text-[11px]"
                textAnchor="end"
                x="580"
                y="224"
              >
                {evidenceChart.axes.xRight}
              </text>

              <g data-evidence-marker>
                <line
                  className="stroke-foreground/50"
                  strokeDasharray="4 5"
                  strokeWidth="1.5"
                  x1={MATERIAL_CREEP_X}
                  x2={MATERIAL_CREEP_X}
                  y1={CHART_BASELINE_Y}
                  y2="102"
                />
                <text
                  className="fill-foreground text-[12px] font-medium"
                  x={MATERIAL_CREEP_X + 8}
                  y="78"
                >
                  <tspan>{formatStat(materialCreepStat)}</tspan>
                  <tspan className="fill-muted-foreground font-normal">
                    {" "}
                    · {evidenceChart.markers.materialCreep.label}
                  </tspan>
                </text>
                <text
                  className="fill-muted-foreground text-[10px]"
                  x={MATERIAL_CREEP_X + 8}
                  y="92"
                >
                  {evidenceChart.markers.materialCreep.detail}
                </text>
              </g>
              <g data-evidence-marker>
                <line
                  className="stroke-foreground/50"
                  strokeDasharray="4 5"
                  strokeWidth="1.5"
                  x1={ANY_OVERRUN_X}
                  x2={ANY_OVERRUN_X}
                  y1={CHART_BASELINE_Y}
                  y2="54"
                />
                <text
                  className="fill-foreground text-[12px] font-medium"
                  textAnchor="middle"
                  x={ANY_OVERRUN_X}
                  y="30"
                >
                  <tspan>{formatStat(anyOverrunStat)}</tspan>
                  <tspan className="fill-muted-foreground font-normal">
                    {" "}
                    · {evidenceChart.markers.anyOverrun.label}
                  </tspan>
                </text>
                <text
                  className="fill-muted-foreground text-[10px]"
                  textAnchor="middle"
                  x={ANY_OVERRUN_X}
                  y="44"
                >
                  {evidenceChart.markers.anyOverrun.detail}
                </text>
              </g>
            </svg>

            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-2.5 rounded-full bg-primary"
                />
                {evidenceChart.legend.curve}
              </li>
              <li className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-5 rounded-sm bg-primary/10"
                />
                {evidenceChart.legend.tailBroad}
              </li>
              <li className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-5 rounded-sm bg-primary/20"
                />
                {evidenceChart.legend.tailStrict}
              </li>
            </ul>
          </figure>
        </div>

        <EvidenceRealChart />

        <div className="mt-8" data-evidence-disclaimer>
          <Alert className="border-white/20 bg-white/60 backdrop-blur-md dark:bg-card/60">
            <AlertTitle>{evidence.disclaimerTitle}</AlertTitle>
            <AlertDescription>{evidence.disclaimer}</AlertDescription>
          </Alert>
        </div>
      </div>
    </section>
  );
}
