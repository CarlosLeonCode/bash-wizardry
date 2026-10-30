import type { CatalogLocale } from "@/lib/catalog.generated";
import { SITE_URL } from "@/lib/urls";

/** Supported locales. English is the default and lives at "/". */
export const LOCALES = ["en", "es"] as const satisfies readonly CatalogLocale[];

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Public path of each locale's home page (no "/en" prefix for English). */
export const LOCALE_PATH: Record<Locale, string> = {
  en: "/",
  es: "/es",
};

/**
 * Absolute URL of each locale's home page, in the exact form Next.js emits
 * for canonical, hreflang and og:url (the root has no trailing slash, which
 * RFC 3986 treats as the same URL as "/"). The sitemap, JSON-LD and llms.txt
 * use it too, so every source names a page the same way.
 */
export const PAGE_URL: Record<Locale, string> = {
  en: SITE_URL,
  es: `${SITE_URL}${LOCALE_PATH.es}`,
};

/** Public path of each locale's privacy policy (only built with leads on). */
export const PRIVACY_PATH: Record<Locale, string> = {
  en: "/privacy",
  es: "/es/privacidad",
};

/** Absolute URL of each locale's privacy policy. */
export const PRIVACY_URL: Record<Locale, string> = {
  en: `${SITE_URL}${PRIVACY_PATH.en}`,
  es: `${SITE_URL}${PRIVACY_PATH.es}`,
};

/** Absolute URL of each locale's social card (app/(en)/og.png, app/(es)/es/og.png). */
export const OG_IMAGE_URL: Record<Locale, string> = {
  en: `${SITE_URL}/og.png`,
  es: `${SITE_URL}${LOCALE_PATH.es}/og.png`,
};

/** Files served next to each locale's home page for LLMs (see src/lib/llms.ts). */
export type LlmsFile = "llms.txt" | "llms-full.txt";

/** Public path of a locale's llms.txt or llms-full.txt, e.g. "/es/llms.txt". */
export const llmsTxtPath = (locale: Locale, file: LlmsFile = "llms.txt") =>
  locale === "en" ? `/${file}` : `${LOCALE_PATH[locale]}/${file}`;

/** Size of the social cards. */
export const OG_SIZE = { width: 1200, height: 630 };

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
