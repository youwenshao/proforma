import type { CSSProperties } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-muted/20 px-6 py-10 text-foreground">
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
            Demo access
          </p>
          <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">
            Pick up where you left off.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            Your saved reports stay in this browser. Sign in to reopen them and export copies
            when you are ready to share or review.
          </p>
          <div className="grid max-w-lg gap-2 text-xs text-muted-foreground sm:grid-cols-3">
            <div className="rounded-lg border border-white/20 bg-white/40 px-3 py-2.5 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              Saved estimates
            </div>
            <div className="rounded-lg border border-white/20 bg-white/40 px-3 py-2.5 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              Report drafts
            </div>
            <div className="rounded-lg border border-white/20 bg-white/40 px-3 py-2.5 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              Evidence notes
            </div>
          </div>
        </div>
        <div className="flex justify-center md:justify-end" data-testid="login-form-panel">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
