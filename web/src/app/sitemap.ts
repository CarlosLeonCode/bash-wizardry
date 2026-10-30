import type { MetadataRoute } from "next";
import { LOCALES, PAGE_URL } from "@/lib/i18n";
import { languageAlternates } from "@/lib/i18n/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = languageAlternates();

  return LOCALES.map((locale) => ({
    url: PAGE_URL[locale],
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages },
  }));
}
