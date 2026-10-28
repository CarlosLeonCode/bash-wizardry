import HeroMotion from "@/components/HeroMotion";
import { GitHubIcon } from "@/components/icons";
import TerminalDemo from "@/components/TerminalDemo";
import { heroSession, REPO_URL } from "@/lib/content";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <HeroMotion className={`container ${styles.inner}`}>
        <p className={styles.badge} data-hero-fade>
          <span className={styles.badgeDot} aria-hidden="true" />
          Open source · Bash &amp; Zsh · No binaries
        </p>

        <h1 id="hero-title" className={styles.title} data-hero-title>
          Your terminal,{" "}
          <span
            className={`text-gradient ${styles.gradient}`}
            data-hero-gradient
          >
            superpowers included.
          </span>
        </h1>

        <p className={styles.subtitle} data-hero-fade>
          A curated spellbook of context-aware shell commands for Git, Node.js,
          Docker, Rails and Django, plus Magic Workspaces that jump you into any
          project. Pure shell, 100% local, fully readable.
        </p>

        <div className={styles.actions} data-hero-fade>
          <a href="#install" className="btn btn-primary">
            Install in one line
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <GitHubIcon />
            View on GitHub
          </a>
        </div>

        <ul className={styles.meta} data-hero-fade aria-label="Highlights">
          <li>macOS · Linux · WSL</li>
          <li>Confirms destructive commands</li>
          <li>MIT licensed</li>
        </ul>

        <div className={styles.visual} data-hero-fade>
          <TerminalDemo session={heroSession} trigger="mount" delay={1.1} />
        </div>
      </HeroMotion>
    </section>
  );
}
