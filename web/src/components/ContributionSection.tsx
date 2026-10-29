import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import type { Dictionary } from "@/lib/i18n";
import { ISSUES_URL, REPO_URL } from "@/lib/site";
import styles from "./ContributionSection.module.css";

const CARDS = [
  {
    id: "contribute",
    command: "cat CONTRIBUTING.md",
    href: `${REPO_URL}/blob/main/CONTRIBUTING.md`,
  },
  { id: "issue", command: "gh issue create", href: ISSUES_URL },
  { id: "star", command: "gh repo view --web", href: REPO_URL },
] as const;

export default function ContributionSection({ t }: { t: Dictionary }) {
  const links = CARDS.map((card) => ({ ...card, ...t.community.cards[card.id] }));

  return (
    <section
      id="community"
      className="section"
      aria-labelledby="community-title"
    >
      <div className="container">
        <SectionHead
          id="community-title"
          command="git remote -v"
          title={t.community.title}
        />

        <Reveal as="ul" className={styles.grid} stagger={0.1}>
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card}
              >
                <span className={styles.command} aria-hidden="true">
                  $ {link.command}
                </span>
                <h3 className={styles.title}>{link.title}</h3>
                <p className={styles.description}>{link.description}</p>
                <span className={styles.cta}>
                  [ {link.cta} <span aria-hidden="true">↗</span> ]
                  <span className="sr-only"> {t.common.newTab}</span>
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
