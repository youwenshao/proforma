"use client";

import type { CSSProperties } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { useTranslations } from "@/lib/i18n/locale-context";

export function LoginMarketingPanel() {
  const t = useTranslations();

  return (
    <>
      <div
        aria-hidden="true"
        className="aurora-background aurora-background-login"
        data-testid="login-aurora-background"
        style={{ "--aurora-image": 'url("/auroras/background-4.jpg")' } as CSSProperties}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-br from-background/50 via-background/35 to-transparent dark:from-background/60 dark:via-background/45 dark:to-transparent"
      />
      <section
        className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-[minmax(0,1fr)_minmax(360px,440px)] md:items-center"
        data-testid="login-page-layout"
      >
        <div className="max-w-2xl space-y-5" data-testid="login-marketing-panel">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            {t("auth.demoAccess")}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">
            {t("auth.pickUp")}
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            {t("auth.pickUpDescription")}
          </p>
          <div className="grid max-w-lg gap-2 text-xs text-muted-foreground sm:grid-cols-3">
            <div className="rounded-lg border border-white/20 bg-white/40 px-3 py-2.5 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              {t("auth.savedEstimates")}
            </div>
            <div className="rounded-lg border border-white/20 bg-white/40 px-3 py-2.5 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              {t("auth.reportDrafts")}
            </div>
            <div className="rounded-lg border border-white/20 bg-white/40 px-3 py-2.5 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              {t("auth.evidenceNotes")}
            </div>
          </div>
        </div>
        <div className="flex justify-center md:justify-end" data-testid="login-form-panel">
          <LoginForm />
        </div>
      </section>
    </>
  );
}
