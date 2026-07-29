"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { RandomAuroraBackground } from "@/components/marketing/random-aurora-background";
import { pitchContent } from "./content";
import { gsap } from "./gsap";
import { useReducedMotion } from "./use-reduced-motion";

const { title } = pitchContent;
const headlineWords = title.headline.split(" ");

/** Legible on aurora photo + gradient: solid foreground, soft scrim shadow, frosted panel. */
const auroraSubheadingClassName =
  "text-foreground [text-shadow:0_1px_1px_color-mix(in_oklch,var(--background)_90%,transparent),0_0_20px_color-mix(in_oklch,var(--background)_75%,transparent)]";

const auroraMetaClassName =
  "text-foreground/90 [text-shadow:0_1px_1px_color-mix(in_oklch,var(--background)_90%,transparent),0_0_16px_color-mix(in_oklch,var(--background)_75%,transparent)]";

export function ActTitle() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from("[data-title-eyebrow]", { autoAlpha: 0, y: 24, duration: 0.8 })
        .from(
          "[data-title-word]",
          {
            autoAlpha: 0,
            y: 44,
            filter: "blur(12px)",
            duration: 0.9,
            stagger: 0.07,
          },
          "-=0.45",
        )
        .from("[data-title-one-liner]", { autoAlpha: 0, y: 24, duration: 0.8 }, "-=0.5")
        .from("[data-title-desc]", { autoAlpha: 0, y: 24, duration: 0.8 }, "-=0.55")
        .from("[data-title-cue]", { autoAlpha: 0, duration: 0.6 }, "-=0.35");

      gsap.to("[data-title-cue-icon]", {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 0.9,
        ease: "power1.inOut",
      });

      // Cinematic exit: the whole hero dissolves upward as the user scrolls on.
      gsap.to("[data-title-inner]", {
        autoAlpha: 0,
        y: -90,
        scale: 0.96,
        filter: "blur(10px)",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom 35%",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-24 sm:px-8"
      ref={sectionRef}
    >
      <RandomAuroraBackground />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-background/75 via-background/60 to-background/30 dark:from-background/85 dark:via-background/70 dark:to-background/40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--background)_50%,transparent)_0%,transparent_72%)] dark:bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--background)_58%,transparent)_0%,transparent_72%)]"
      />
      <div
        className="relative mx-auto flex max-w-5xl flex-col items-center rounded-3xl border border-white/25 bg-background/55 px-6 py-10 text-center shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-background/65 sm:px-10"
        data-title-inner
      >
        <p
          className="text-xs font-medium uppercase tracking-[0.28em] text-primary sm:text-sm"
          data-title-eyebrow
        >
          {title.eyebrow}
        </p>
        <h1 className="mt-8 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
          {headlineWords.map((word, index) => (
            <span className="inline-block" data-title-word key={`${word}-${index}`}>
              {word}
              {index < headlineWords.length - 1 ? "\u00A0" : null}
            </span>
          ))}
        </h1>
        <p
          className={`mt-8 max-w-3xl text-balance text-lg leading-8 sm:text-xl ${auroraSubheadingClassName}`}
          data-title-one-liner
        >
          {title.productOneLiner}
        </p>
        <p
          className={`mt-6 max-w-2xl text-balance text-base leading-7 ${auroraMetaClassName}`}
          data-title-desc
        >
          {title.description}
        </p>
        <div
          className={`mt-16 flex flex-col items-center gap-2 text-sm ${auroraMetaClassName}`}
          data-title-cue
        >
          <span className="uppercase tracking-[0.24em]">{title.cue}</span>
          <ChevronDown aria-hidden="true" className="h-5 w-5" data-title-cue-icon />
        </div>
      </div>
    </section>
  );
}
