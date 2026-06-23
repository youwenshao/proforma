"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { resolveLocale, type Locale } from "@/lib/i18n/locales";

const footerLinks = [
  { href: "/estimate/new", label: "New estimate" },
  { href: "/results", label: "Results" },
  { href: "/models", label: "Model evidence" },
];

function LanguageToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeLocale = resolveLocale(searchParams.get("locale"));

  function selectLocale(locale: Locale) {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("locale", locale);
    router.replace(`?${nextParams.toString()}`, { scroll: false });
  }

  return (
    <span aria-label="Interface language" className="inline-flex items-center gap-1.5 text-sm">
      <button
        aria-pressed={activeLocale === "en"}
        className={`transition-colors ${activeLocale === "en" ? "text-white" : "text-white/50 hover:text-white/80"}`}
        onClick={() => selectLocale("en")}
        type="button"
      >
        EN
      </button>
      <span aria-hidden="true" className="text-white/30">|</span>
      <button
        aria-pressed={activeLocale === "zh-Hant"}
        className={`transition-colors ${activeLocale === "zh-Hant" ? "text-white" : "text-white/50 hover:text-white/80"}`}
        onClick={() => selectLocale("zh-Hant")}
        type="button"
      >
        繁
      </button>
    </span>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#0f1117] text-white/70" role="contentinfo">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                alt=""
                className="h-6 w-6 object-contain invert"
                height={24}
                src="/proforma-logo-light.png"
                width={24}
              />
              <span className="text-base font-medium tracking-tight text-white">
                ProForma
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed">
              Feasibility-stage pricing intelligence for Hong Kong legal teams.
              This demo does not approve legal, regulatory, or client-facing fee decisions.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-white/50">Sentimento Technologies Limited</span>
              <a
                className="text-white/50 transition-colors hover:text-white"
                href="https://www.sentimento.dev"
              >
                sentimento.dev
              </a>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 sm:items-end">
            <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
              {footerLinks.map((link) => (
                <Link
                  className="text-white/50 transition-colors hover:text-white"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Suspense fallback={null}>
              <LanguageToggle />
            </Suspense>
          </div>
        </div>
      </div>
    </footer>
  );
}
