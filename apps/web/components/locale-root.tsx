"use client";

import { Suspense, type ReactNode } from "react";
import { HtmlLangSync, LocaleProvider } from "@/lib/i18n/locale-context";

export function LocaleRoot({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <LocaleProvider>
        <HtmlLangSync />
        {children}
      </LocaleProvider>
    </Suspense>
  );
}
