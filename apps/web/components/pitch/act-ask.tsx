"use client";

import { ShieldOff, Scale, FileX2, Gavel } from "lucide-react";
import { useEffect, useRef } from "react";
import { LocalizedLink } from "@/components/localized-link";
import { Button } from "@/components/ui/button";
import { RandomAuroraBackground } from "@/components/marketing/random-aurora-background";
import { pitchContent } from "./content";
import { gsap } from "./gsap";
import { useReducedMotion } from "./use-reduced-motion";

const { ask } = pitchContent;

const guardrailIcons = [Scale, ShieldOff, FileX2, Gavel];

export function ActAsk() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from("[data-ask-guardrails-heading]", {
        autoAlpha: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-ask-guardrails-heading]",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from("[data-ask-guardrail]", {
        autoAlpha: 0,
        y: 50,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-ask-guardrails]",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from("[data-ask-heading]", {
        autoAlpha: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-ask-heading]",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from("[data-ask-item]", {
        autoAlpha: 0,
        x: -40,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-ask-items]",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from("[data-ask-cta] > *", {
        autoAlpha: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-ask-cta]",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="bg-background" ref={sectionRef}>
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 lg:py-32">
        <div data-ask-guardrails-heading>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary sm:text-sm">
            {ask.guardrailsEyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            {ask.guardrailsHeading}
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2" data-ask-guardrails>
          {ask.guardrails.map((guardrail, index) => {
            const Icon = guardrailIcons[index % guardrailIcons.length];

            return (
              <div
                className="rounded-2xl border border-white/20 bg-white/45 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-card/50"
                data-ask-guardrail
                key={guardrail.title}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">
                  {guardrail.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {guardrail.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-28" data-ask-heading>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary sm:text-sm">
            {ask.askEyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            {ask.askHeading}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            {ask.askIntro}
          </p>
        </div>

        <div className="mt-12 space-y-5" data-ask-items>
          {ask.asks.map((item) => (
            <div
              className="flex flex-col gap-3 rounded-2xl border border-white/20 bg-white/45 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-card/50 sm:flex-row sm:items-start sm:gap-6 sm:p-8"
              data-ask-item
              key={item.index}
            >
              <p className="font-mono text-sm text-primary sm:pt-1">{item.index}</p>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative isolate overflow-hidden">
        <RandomAuroraBackground />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background/20"
        />
        <div
          className="relative mx-auto flex max-w-4xl flex-col items-center px-5 py-28 text-center sm:px-8 lg:py-36"
          data-ask-cta
        >
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            {ask.ctaHeading}
          </h2>
          <p className="mt-6 max-w-2xl text-balance text-base leading-7 text-muted-foreground sm:text-lg">
            {ask.ctaDescription}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <LocalizedLink href="/estimate/new">{ask.ctaPrimary}</LocalizedLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <LocalizedLink href="/models">{ask.ctaSecondary}</LocalizedLink>
            </Button>
          </div>
          <p className="mt-16 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {ask.closing}
          </p>
        </div>
      </div>
    </section>
  );
}
