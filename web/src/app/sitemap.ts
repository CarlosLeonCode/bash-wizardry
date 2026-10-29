import type { MetadataRoute } from "next";
import { LOCALE_PATH, LOCALES } from "@/lib/i18n";
import { languageAlternates } from "@/lib/i18n/metadata";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = languageAlternates(SITE_URL);

  return LOCALES.map((locale) => ({
    url: `${SITE_URL}${LOCALE_PATH[locale]}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages },
  }));
}
