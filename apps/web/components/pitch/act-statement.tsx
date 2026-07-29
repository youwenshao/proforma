"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { pitchContent } from "./content";
import { gsap } from "./gsap";
import { useReducedMotion } from "./use-reduced-motion";

const { statement } = pitchContent;

function Words({
  text,
  reducedMotion,
  accent = false,
}: {
  text: string;
  reducedMotion: boolean;
  accent?: boolean;
}) {
  return (
    <>
      {text.split(" ").map((word, index) => (
        <span
          className={cn(
            "inline-block",
            accent && "text-primary",
            !reducedMotion && "opacity-15",
          )}
          data-statement-word
          key={`${word}-${index}`}
        >
          {word}
          {"\u00A0"}
        </span>
      ))}
    </>
  );
}

export function ActStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-statement-word]");

      // The illumination pattern: each word brightens in reading order as the
      // reader scrolls through the tall section, and dims again in reverse.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        })
        .from("[data-statement-eyebrow]", {
          autoAlpha: 0,
          y: 20,
          duration: 2,
          ease: "none",
        })
        .to(
          words,
          { opacity: 1, duration: 1, stagger: 0.4, ease: "none" },
          0.5,
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="bg-background px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary sm:text-sm">
            {statement.eyebrow}
          </p>
          <p className="text-3xl font-medium leading-snug tracking-tight sm:text-4xl">
            {statement.lead}{" "}
            <span className="text-primary">{statement.accent}</span>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[240vh] bg-background" ref={sectionRef}>
      <div className="sticky top-0 flex h-[100svh] items-center px-5 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <p
            className="text-xs font-medium uppercase tracking-[0.28em] text-primary sm:text-sm"
            data-statement-eyebrow
          >
            {statement.eyebrow}
          </p>
          <p className="mt-8 text-3xl font-medium leading-snug tracking-tight sm:text-4xl lg:text-5xl">
            <Words reducedMotion={reducedMotion} text={statement.lead} />
            <Words accent reducedMotion={reducedMotion} text={statement.accent} />
          </p>
        </div>
      </div>
    </section>
  );
}
