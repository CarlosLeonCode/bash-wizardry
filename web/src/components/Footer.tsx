import LeadUpdatesButton from "@/components/LeadUpdatesButton";
import {
  llmsTxtPath,
  LOCALE_PATH,
  PRIVACY_PATH,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";
import { LEADS_ENABLED } from "@/lib/leads";
import { AUTHOR, ISSUES_URL, REPO_URL, SPELL_COUNT } from "@/lib/site";
import styles from "./Footer.module.css";

export default function Footer({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary;
}) {
  const { footer } = t;
  const l = footer.links;
  // Section anchors point at the home page: the footer is also on /privacy.
  const home = LOCALE_PATH[locale];
  const columns = [
    {
      title: footer.columns.product,
      links: [
        { label: l.tour, href: `${home}#tour` },
        { label: l.spellbook, href: `${home}#spellbook` },
        { label: l.install, href: `${home}#install` },
      ],
    },
    {
      title: footer.columns.project,
      links: [
        { label: l.source, href: REPO_URL },
        { label: l.releases, href: `${REPO_URL}/releases` },
        { label: l.license, href: `${REPO_URL}/blob/main/LICENSE` },
        // Plain-text summary for LLMs and AI answer engines (llmstxt.org).
        { label: "llms.txt", href: llmsTxtPath(locale) },
        // Only exists when the optional subscription is on (src/lib/leads.ts).
        ...(LEADS_ENABLED
          ? [{ label: t.leads.privacy, href: PRIVACY_PATH[locale] }]
          : []),
      ],
    },
    {
      title: footer.columns.community,
      links: [
        { label: l.contributing, href: `${REPO_URL}/blob/main/CONTRIBUTING.md` },
        { label: l.issues, href: ISSUES_URL },
        { label: l.youtube, href: AUTHOR.youtube },
        { label: l.kofi, href: AUTHOR.kofi },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <p className={`${styles.logo} glow`}>
            <span aria-hidden="true">&gt; </span>bash-wizardry
          </p>
          <p className={styles.tagline}>
            # {footer.tagline}
          </p>
          {LEADS_ENABLED && (
            <LeadUpdatesButton
              label={t.leads.getUpdates}
              className={`btn-ghost ${styles.updates}`}
            />
          )}
        </div>

        <nav className={styles.columns} aria-label={footer.label}>
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className={styles.heading}>
                <span aria-hidden="true">## </span>
                {column.title}
              </h2>
              <ul className={styles.list}>
                {column.links.map((link) => {
                  const external = link.href.startsWith("http");
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(external && {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        })}
                      >
                        {link.label}
                        {external && (
                          <>
                            {" "}
                            <span aria-hidden="true">↗</span>
                            <span className="sr-only"> {t.common.newTab}</span>
                          </>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© {new Date().getFullYear()} bash-wizardry · {footer.license}</p>
        <p>
          {footer.builtBy} <a
            href={AUTHOR.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {AUTHOR.handle}
          </a>
        </p>
      </div>

      <div className={styles.statusbar} aria-hidden="true">
        <div className={styles.left}>
          <span className={styles.mode}>NORMAL</span>
          <span>main</span>
          <span>bats ✓</span>
        </div>
        <div className={styles.right}>
          <span className={styles.wide}>shellcheck ✓ │ </span>
          <span className={styles.wide}>{SPELL_COUNT} {footer.spells} │ </span>
          utf-8 │ bash · zsh
        </div>
      </div>
    </footer>
  );
}
