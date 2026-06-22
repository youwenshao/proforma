import { enMessages, type TranslationKey } from "./en";
import { defaultLocale, type Locale, resolveLocale } from "./locales";
import { zhHantMessages } from "./zh-Hant";

const catalogs: Record<Locale, Record<TranslationKey, string>> = {
  en: enMessages,
  "zh-Hant": zhHantMessages,
};

type TranslateOptions = {
  allowFallback?: boolean;
};

export function translate(
  localeInput: Locale | string | null | undefined,
  key: TranslationKey | string,
  options: TranslateOptions = {},
) {
  const { allowFallback = true } = options;
  const locale = resolveLocale(localeInput);
  const translation = catalogs[locale][key as TranslationKey];

  if (translation) {
    return translation;
  }

  if (allowFallback && locale !== defaultLocale) {
    const fallback = catalogs[defaultLocale][key as TranslationKey];

    if (fallback) {
      return fallback;
    }
  }

  throw new Error(`Missing translation for ${locale}:${key}`);
}

export type { TranslationKey };
