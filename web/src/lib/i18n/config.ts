import type { CatalogLocale } from "@/lib/catalog.generated";

/** Supported locales. English is the default and lives at "/". */
export const LOCALES = ["en", "es"] as const satisfies readonly CatalogLocale[];

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Public path of each locale's home page (no "/en" prefix for English). */
export const LOCALE_PATH: Record<Locale, string> = {
  en: "/",
  es: "/es",
};

/** Open Graph locale of each page. */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
};

/** Name of each language in that language, for the switcher's labels. */
export const LOCALE_NAME: Record<Locale, string> = {
  en: "English",
  es: "Español",
};
