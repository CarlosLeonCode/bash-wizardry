import Footer from "@/components/Footer";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import {
  getDictionary,
  LOCALE_PATH,
  LOCALES,
  PRIVACY_PATH,
  type Locale,
} from "@/lib/i18n";
import styles from "./PrivacyPage.module.css";

/** /privacy and /es/privacidad: a plain long-form page in the site's frame. */
export default function PrivacyPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const other = LOCALES.find((l) => l !== locale) ?? locale;

  return (
    <div id="top">
      <a href="#main" className="skip-link">
        {t.common.skipToContent}
      </a>

      <header className={styles.header}>
        <nav
          className={`container ${styles.nav}`}
          aria-label={t.privacy.navLabel}
        >
          <a href={LOCALE_PATH[locale]} className={`${styles.home} glow`}>
            <span aria-hidden="true">&gt; </span>bash-wizardry
            <span className="sr-only">: {t.privacy.back}</span>
          </a>
          <a
            href={PRIVACY_PATH[other]}
            hrefLang={other}
            lang={other}
            className={styles.lang}
          >
            [ {t.privacy.otherLanguage} ]
          </a>
        </nav>
      </header>

      <main id="main" className="container">
        <article className={styles.article}>
          <p className="prompt" aria-hidden="true">
            cat {locale === "es" ? "PRIVACIDAD.md" : "PRIVACY.md"}
          </p>
          <h1 className={styles.title}>{t.privacy.title}</h1>
          <PrivacyPolicy locale={locale} />
          <p className={styles.back}>
            <a href={LOCALE_PATH[locale]} className="btn-ghost">
              [ cd ~ ] {t.privacy.back}
            </a>
          </p>
        </article>
      </main>

      <Footer locale={locale} t={t} />
    </div>
  );
}
