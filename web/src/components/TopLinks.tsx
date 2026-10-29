import type { Dictionary } from "@/lib/i18n";
import { AUTHOR, ISSUES_URL, REPO_URL, SITE_URL } from "@/lib/site";
import styles from "./TopLinks.module.css";

interface ExternalLink {
  /** Short visible text. */
  label: string;
  /** Accessible name; starts with the visible text. */
  ariaLabel: string;
  href: string;
}

function LinkGroup({
  title,
  links,
  newTab,
}: {
  title: string;
  links: ExternalLink[];
  newTab: string;
}) {
  return (
    <div className={styles.group}>
      <span className={styles.title} aria-hidden="true">
        {title}
      </span>
      <ul className={styles.list} aria-label={title.replace(/:$/, "")}>
        {links.map((link) => {
          // The project site is this site: stay in the same tab.
          const sameSite = link.href === SITE_URL;
          return (
            <li key={link.href}>
              <a
                href={link.href}
                className={styles.link}
                aria-label={
                  sameSite ? link.ariaLabel : `${link.ariaLabel} ${newTab}`
                }
                {...(!sameSite && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** First line of the page: project links and the author's social links. */
export default function TopLinks({ t }: { t: Dictionary }) {
  const { projectLinks, authorLinks } = t.topLinks;

  const project: ExternalLink[] = [
    { label: "github", ariaLabel: projectLinks.github, href: REPO_URL },
    { label: "issues", ariaLabel: projectLinks.issues, href: ISSUES_URL },
    { label: "web", ariaLabel: projectLinks.web, href: SITE_URL },
  ];

  const author: ExternalLink[] = [
    { label: "github", ariaLabel: authorLinks.github, href: AUTHOR.github },
    { label: "youtube", ariaLabel: authorLinks.youtube, href: AUTHOR.youtube },
    { label: "web", ariaLabel: authorLinks.web, href: AUTHOR.url },
    { label: "ko-fi", ariaLabel: authorLinks.kofi, href: AUTHOR.kofi },
  ];

  return (
    <nav className={styles.bar} aria-label={t.topLinks.label}>
      <LinkGroup title={t.topLinks.project} links={project} newTab={t.common.newTab} />
      <span className={styles.sep} aria-hidden="true">
        │
      </span>
      <LinkGroup
        title={`@${AUTHOR.handle}:`}
        links={author}
        newTab={t.common.newTab}
      />
    </nav>
  );
}
