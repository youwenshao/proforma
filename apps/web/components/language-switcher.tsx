"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  localeLabels,
  locales,
  resolveLocale,
  type Locale,
} from "@/lib/i18n/locales";

export function LanguageSwitcher() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeLocale = resolveLocale(searchParams.get("locale"));

  const baseParams = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );

  function selectLocale(locale: Locale) {
    const nextParams = new URLSearchParams(baseParams.toString());
    nextParams.set("locale", locale);
    router.replace(`?${nextParams.toString()}`, { scroll: false });
  }

  return (
    <div aria-label="Interface language" className="flex flex-wrap gap-2">
      {locales.map((locale) => (
        <Button
          aria-pressed={locale === activeLocale}
          key={locale}
          onClick={() => selectLocale(locale)}
          size="sm"
          type="button"
          variant={locale === activeLocale ? "default" : "outline"}
        >
          {localeLabels[locale]}
        </Button>
      ))}
    </div>
  );
}
