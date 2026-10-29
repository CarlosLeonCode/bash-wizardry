import { en } from "@/lib/i18n/en";
import { es } from "@/lib/i18n/es";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

export * from "@/lib/i18n/config";
export type * from "@/lib/i18n/types";

const DICTIONARIES: Record<Locale, Dictionary> = { en, es };

/** Copy for one locale. Server-side only: pass slices to client components. */
export const getDictionary = (locale: Locale): Dictionary =>
  DICTIONARIES[locale];
