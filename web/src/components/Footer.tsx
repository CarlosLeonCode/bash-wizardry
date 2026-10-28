import { REPO_URL } from "@/lib/content";
import styles from "./Footer.module.css";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Tour", href: "#tour" },
      { label: "Spellbook", href: "#spellbook" },
      { label: "Install", href: "#install" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Source code", href: REPO_URL },
      { label: "Releases", href: `${REPO_URL}/releases` },
      { label: "MIT License", href: `${REPO_URL}/blob/main/LICENSE` },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Contributing", href: `${REPO_URL}/blob/main/CONTRIBUTING.md` },
      { label: "Issues", href: `${REPO_URL}/issues` },
      { label: "X / Twitter", href: "https://twitter.com/CarlosLeonCode" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <p className={styles.logo}>
            <span aria-hidden="true">🧙‍♂️</span> bash-wizardry
          </p>
          <p className={styles.tagline}>
            The developer productivity toolkit that lives in your terminal.
            Safe, fast and hackable.
          </p>
        </div>

        <nav className={styles.columns} aria-label="Footer">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className={styles.heading}>{column.title}</h2>
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
        <p>© {new Date().getFullYear()} bash-wizardry · MIT License</p>
        <p>
          Designed &amp; built by{" "}
          <a
            href="https://github.com/CarlosLeonCode"
            target="_blank"
            rel="noopener noreferrer"
          >
            Carlos Leon
          </a>
        </p>
      </div>
    </footer>
  );
}
