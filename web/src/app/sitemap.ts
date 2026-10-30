import type { MetadataRoute } from "next";
import { LOCALES, PAGE_URL, PRIVACY_URL } from "@/lib/i18n";
import { languageAlternates } from "@/lib/i18n/metadata";
import { LEADS_ENABLED } from "@/lib/leads";

export default function sitemap(): MetadataRoute.Sitemap {
  const home = LOCALES.map((locale) => ({
    url: PAGE_URL[locale],
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages: languageAlternates() },
  }));

  // The privacy pages only exist with the optional subscription on.
  const privacy = LEADS_ENABLED
    ? LOCALES.map((locale) => ({
        url: PRIVACY_URL[locale],
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.3,
        alternates: { languages: languageAlternates(PRIVACY_URL) },
      }))
    : [];

  return [...home, ...privacy];
}
