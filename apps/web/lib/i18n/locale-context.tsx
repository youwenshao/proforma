"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import { defaultLocale, resolveLocale, type Locale } from "./locales";
import { translate, type TranslationKey } from "./translator";

type TranslateValues = Record<string, string | number>;

type LocaleContextValue = {
  locale: Locale;
  t: (key: TranslationKey, values?: TranslateValues) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("locale"));

  const t = useCallback(
    (key: TranslationKey, values?: TranslateValues) => translate(locale, key, { values }),
    [locale],
  );

  const value = useMemo(() => ({ locale, t }), [locale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }

  return context;
}

export function useTranslations() {
  return useLocale().t;
}

export function HtmlLangSync() {
  const { locale, t } = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    document.title = t("app.pageTitle");
  }, [locale, t]);

  return null;
}

export function useLocalizedHref(href: string): string {
  const { locale } = useLocale();

  if (
    locale === defaultLocale ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("#") ||
    href.startsWith("/v1/")
  ) {
    return href;
  }

  const [path, hash = ""] = href.split("#");
  const [pathname, query = ""] = path.split("?");
  const params = new URLSearchParams(query);
  params.set("locale", locale);
  const queryString = params.toString();
  const localizedPath = queryString ? `${pathname}?${queryString}` : pathname;

  return hash ? `${localizedPath}#${hash}` : localizedPath;
}
