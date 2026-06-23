import { enMessages, interpolate, type TranslationKey } from "./en";
import { defaultLocale, type Locale, resolveLocale } from "./locales";
import { zhHantMessages } from "./zh-Hant";

const catalogs: Record<Locale, Record<TranslationKey, string>> = {
  en: enMessages,
  "zh-Hant": zhHantMessages,
};

type TranslateOptions = {
  allowFallback?: boolean;
  values?: Record<string, string | number>;
};

export function translate(
  localeInput: Locale | string | null | undefined,
  key: TranslationKey | string,
  options: TranslateOptions = {},
) {
  const { allowFallback = true, values } = options;
  const locale = resolveLocale(localeInput);
  const translation = catalogs[locale][key as TranslationKey];

  let message: string | undefined;

  if (translation) {
    message = translation;
  } else if (allowFallback && locale !== defaultLocale) {
    message = catalogs[defaultLocale][key as TranslationKey];
  }

  if (!message) {
    throw new Error(`Missing translation for ${locale}:${key}`);
  }

  return values ? interpolate(message, values) : message;
}

export type { TranslationKey };
