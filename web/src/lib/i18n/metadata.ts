import type { Metadata, Viewport } from "next";
import {
  getDictionary,
  LOCALE_PATH,
  LOCALES,
  OG_LOCALE,
  type Locale,
} from "@/lib/i18n";
import { AUTHOR, REPO_URL, SITE_URL } from "@/lib/site";

/** hreflang map shared by page metadata and the sitemap. */
export const languageAlternates = (base = "") => ({
  en: `${base}${LOCALE_PATH.en}`,
  es: `${base}${LOCALE_PATH.es}`,
  "x-default": `${base}${LOCALE_PATH.en}`,
});

/** Full metadata of one locale's home page. */
export function buildMetadata(locale: Locale): Metadata {
  const { meta } = getDictionary(locale);
  const path = LOCALE_PATH[locale];

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: meta.title,
      template: "%s | Bash Wizardry",
    },
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: "Carlos Leon Code", url: AUTHOR.url }],
    creator: "Carlos Leon Code",
    publisher: "Carlos Leon Code",
    alternates: {
      canonical: path,
      languages: languageAlternates(),
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: path,
      siteName: "Bash Wizardry",
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map(
        (l) => OG_LOCALE[l],
      ),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      creator: "@CarlosLeonCode",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    // The manifest link is emitted automatically from app/manifest.ts
    // (served at /manifest.webmanifest), so it is not declared here.
  };
}

export const viewport: Viewport = {
  themeColor: "#020502",
  colorScheme: "dark",
};

/** schema.org SoftwareApplication for one locale's page. */
export function buildJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bash Wizardry",
    url: new URL(LOCALE_PATH[locale], SITE_URL).href,
    inLanguage: locale,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows (WSL)",
    description: getDictionary(locale).meta.appDescription,
    license: "https://opensource.org/licenses/MIT",
    sameAs: [REPO_URL],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: AUTHOR.name,
      url: AUTHOR.url,
      sameAs: [AUTHOR.github, AUTHOR.youtube],
    },
  };
}
