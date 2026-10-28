import Reveal from "@/components/Reveal";
import { REPO_URL } from "@/lib/content";
import styles from "./ContributionSection.module.css";

const links = [
  {
    title: "Contribute",
    description:
      "New spells, fixes and docs are welcome. Start with the guide.",
    cta: "Read the guide",
    href: `${REPO_URL}/blob/main/CONTRIBUTING.md`,
  },
  {
    title: "Report an issue",
    description: "Found a bug or a rough edge? Open an issue on GitHub.",
    cta: "Open an issue",
    href: `${REPO_URL}/issues`,
  },
  {
    title: "Star the repo",
    description: "Stars help other developers discover the project.",
    cta: "Star on GitHub",
    href: REPO_URL,
  },
];

export default function ContributionSection() {
  return (
    <section
      id="community"
      className="section"
      aria-labelledby="community-title"
    >
      <div className="container">
        <Reveal className="section-head section-head--center">
          <p className="eyebrow">Open source</p>
          <h2 id="community-title" className="section-title">
            Built by developers, for developers
          </h2>
        </Reveal>

        <Reveal className={styles.grid} stagger={0.1}>
          {links.map((link) => (
            <a
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <h3 className={styles.title}>{link.title}</h3>
              <p className={styles.description}>{link.description}</p>
              <span className={styles.cta}>
                {link.cta}
                <span aria-hidden="true" className={styles.arrow}>
                  →
                </span>
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
