import type { Metadata, Viewport } from "next";
import {
  getDictionary,
  LOCALES,
  llmsTxtPath,
  OG_IMAGE_URL,
  OG_LOCALE,
  OG_SIZE,
  PAGE_URL,
  PRIVACY_URL,
  type Locale,
} from "@/lib/i18n";
import {
  AGENT_FAQ_IDS,
  AUTHOR,
  HERO_FILM,
  HERO_FILM_ISO_DURATION,
  HERO_FILM_UPLOAD_DATE,
  INSTALL_SCRIPT_URL,
  REPO_URL,
  SITE_URL,
  TOOLS,
} from "@/lib/site";

const LICENSE_URL = "https://opensource.org/licenses/MIT";

/**
 * hreflang map shared by page metadata and the sitemap (absolute URLs).
 * Defaults to the home pages; pass another page's URLs (e.g. PRIVACY_URL).
 */
export const languageAlternates = (urls: Record<Locale, string> = PAGE_URL) => ({
  en: urls.en,
  es: urls.es,
  "x-default": urls.en,
});

/** Full metadata of one locale's home page. */
export function buildMetadata(locale: Locale): Metadata {
  const { meta } = getDictionary(locale);
  const image = {
    url: OG_IMAGE_URL[locale],
    ...OG_SIZE,
    alt: meta.og.alt,
    type: "image/png",
  };

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
      canonical: PAGE_URL[locale],
      languages: languageAlternates(),
      types: {
        "text/plain": [{ url: llmsTxtPath(locale), title: "llms.txt" }],
      },
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: PAGE_URL[locale],
      siteName: "Bash Wizardry",
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map(
        (l) => OG_LOCALE[l],
      ),
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      creator: "@CarlosLeonCode",
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    // The manifest link is emitted automatically from app/manifest.ts
    // (served at /manifest.webmanifest), so it is not declared here.
  };
}

/**
 * Metadata of one locale's privacy policy. Replaces the layout's alternates,
 * Open Graph and Twitter blocks (Next.js merges metadata per top-level key),
 * so canonical and hreflang point at the privacy pages, not the home pages.
 */
export function buildPrivacyMetadata(locale: Locale): Metadata {
  const { privacy, meta } = getDictionary(locale);
  const image = {
    url: OG_IMAGE_URL[locale],
    ...OG_SIZE,
    alt: meta.og.alt,
    type: "image/png",
  };

  return {
    title: privacy.title,
    description: privacy.description,
    alternates: {
      canonical: PRIVACY_URL[locale],
      languages: languageAlternates(PRIVACY_URL),
    },
    openGraph: {
      title: `${privacy.title} | Bash Wizardry`,
      description: privacy.description,
      url: PRIVACY_URL[locale],
      siteName: "Bash Wizardry",
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map(
        (l) => OG_LOCALE[l],
      ),
      type: "article",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${privacy.title} | Bash Wizardry`,
      description: privacy.description,
      creator: "@CarlosLeonCode",
      images: [image],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#020502",
  colorScheme: "dark",
};

/** Copy text without the `backticks` that RichText turns into <code>. */
const plain = (text: string) => text.replaceAll("`", "");

/**
 * schema.org graph of one locale's page: the site, the app and its source,
 * the author, the hero film, the agents FAQ and the author's other tools
 * (same text as on the page).
 */
export function buildJsonLd(locale: Locale) {
  const t = getDictionary(locale);
  const url = PAGE_URL[locale];
  const film = HERO_FILM[locale];
  const id = {
    website: `${SITE_URL}/#website`,
    app: `${SITE_URL}/#app`,
    source: `${SITE_URL}/#source`,
    author: `${SITE_URL}/#author`,
    film: `${SITE_URL}/#film-${locale}`,
    faq: `${SITE_URL}/#faq-${locale}`,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": id.website,
        url: PAGE_URL.en,
        name: "Bash Wizardry",
        inLanguage: [...LOCALES],
        publisher: { "@id": id.author },
      },
      {
        "@type": "SoftwareApplication",
        "@id": id.app,
        name: "Bash Wizardry",
        alternateName: "bash-wizardry",
        url,
        inLanguage: locale,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "macOS, Linux, Windows (WSL)",
        description: t.meta.appDescription,
        featureList: t.meta.features,
        downloadUrl: INSTALL_SCRIPT_URL,
        installUrl: INSTALL_SCRIPT_URL,
        image: OG_IMAGE_URL[locale],
        screenshot: OG_IMAGE_URL[locale],
        license: LICENSE_URL,
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        author: { "@id": id.author },
        video: { "@id": id.film },
        sameAs: [REPO_URL],
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": id.source,
        name: "bash-wizardry",
        codeRepository: REPO_URL,
        programmingLanguage: ["Shell", "Bash", "Zsh"],
        license: LICENSE_URL,
        author: { "@id": id.author },
        targetProduct: { "@id": id.app },
      },
      {
        "@type": "Person",
        "@id": id.author,
        name: AUTHOR.name,
        alternateName: AUTHOR.handle,
        url: AUTHOR.url,
        image: `${SITE_URL}/avatar-carlosleoncode.webp`,
        sameAs: [AUTHOR.github, AUTHOR.youtube, AUTHOR.kofi],
      },
      {
        "@type": "VideoObject",
        "@id": id.film,
        name: t.meta.filmName,
        description: t.hero.film.summary,
        inLanguage: locale,
        thumbnailUrl: `${SITE_URL}${film.poster}`,
        contentUrl: `${SITE_URL}${film.src}`,
        uploadDate: HERO_FILM_UPLOAD_DATE,
        duration: HERO_FILM_ISO_DURATION,
        author: { "@id": id.author },
      },
      {
        "@type": "FAQPage",
        "@id": id.faq,
        url,
        name: `Bash Wizardry · ${t.agents.faq.title}`,
        inLanguage: locale,
        isPartOf: { "@id": id.website },
        about: { "@id": id.app },
        mainEntity: AGENT_FAQ_IDS.map((faqId) => {
          const { question, answer } = t.agents.faq.items[faqId];
          return {
            "@type": "Question",
            name: plain(question),
            acceptedAnswer: { "@type": "Answer", text: plain(answer) },
          };
        }),
      },
      ...TOOLS.map((tool) => ({
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#tool-${tool.id}`,
        name: tool.name,
        url: tool.url,
        description: t.tools.items[tool.id].description,
        author: { "@id": id.author },
      })),
    ],
  };
}

/** JSON-LD as a <script> body: "<" is escaped so no text can close the tag. */
export const jsonLdScript = (locale: Locale) =>
  JSON.stringify(buildJsonLd(locale)).replaceAll("<", "\\u003c");
