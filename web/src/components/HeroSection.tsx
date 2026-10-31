import Image from "next/image";
import HeroFilm from "@/components/HeroFilm";
import HeroMotion from "@/components/HeroMotion";
import InstallCopyButton from "@/components/InstallCopyButton";
import SeasonalCenterpiece from "@/components/SeasonalCenterpiece";
import { LOGO_STACKED, LOGO_WIDE } from "@/lib/ascii";
import type { Dictionary, Locale } from "@/lib/i18n";
import {
  AGENT_COMMANDS,
  AUTHOR,
  HERO_FILM,
  INSTALL_COMMAND,
  REPO_URL,
  type BootStatus,
} from "@/lib/site";
import styles from "./HeroSection.module.css";

const STATUS_TAG: Record<BootStatus, string> = {
  init: "[0.004]",
  ok: "[  OK  ]",
  skip: "[ SKIP ]",
  ready: "[ READY]",
};

function Cmd({ cmd }: { cmd: string }) {
  return (
    <div className={styles.cmdLine} data-cmd-line>
      <span className={styles.arrow}>❯</span>{" "}
      <span className={styles.cmd} data-cmd={cmd}>
        {cmd}
      </span>
    </div>
  );
}

export default function HeroSection({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary;
}) {
  const { hero } = t;
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <HeroMotion className={`container ${styles.inner}`}>
        <div className={styles.logo} aria-hidden="true" data-logo>
          <pre className={`${styles.art} ${styles.wide} glow`} data-logo-art>
            {LOGO_WIDE}
          </pre>
          <pre className={`${styles.art} ${styles.stacked} glow`} data-logo-art>
            {LOGO_STACKED}
          </pre>
          <span className={`${styles.wordmark} glow`}>
            BASH
            <br />
            WIZARDRY
          </span>
        </div>

        <div className={styles.sigRow}>
          <a
            className={styles.signature}
            href={AUTHOR.url}
            target="_blank"
            rel="noopener noreferrer"
            data-hero-fade
          >
            <Image
              className={styles.avatar}
              src="/avatar-carlosleoncode.webp"
              alt=""
              width={40}
              height={40}
              priority
            />
            <span className={styles.sigText}>
              <span className={styles.sigLabel}>{hero.createdBy}</span>
              <span className={styles.sigHandle}>@{AUTHOR.handle}</span>
            </span>
            <span className={styles.sigUrl} aria-hidden="true">
              carlosleoncode.com ↗
            </span>
            <span className="sr-only"> {t.common.newTab}</span>
          </a>
          <SeasonalCenterpiece />
        </div>

        <h1 id="hero-title" className={styles.title} data-hero-title>
          <span className={styles.chevron} aria-hidden="true">
            &gt;
          </span>
          <span className={styles.titleText}>
            <span data-hero-text>
              {hero.titleLines[0]}
              <br />
              {hero.titleLines[1]}
            </span>
            <span className={styles.cursor} data-hero-cursor aria-hidden="true" />
          </span>
          <span
            className={`${styles.cursor} ${styles.typingCursor}`}
            data-hero-typing-cursor
            aria-hidden="true"
          />
        </h1>

        <p className={styles.lead} data-hero-fade>
          <span># {hero.lead[0]}</span> <span># {hero.lead[1]}</span>
        </p>

        <div className={styles.actions} data-hero-fade>
          <div className={styles.install}>
            <code className={styles.installCmd}>
              <span className={styles.dollar} aria-hidden="true">
                ${" "}
              </span>
              {INSTALL_COMMAND}
            </code>
            <InstallCopyButton
              text={INSTALL_COMMAND}
              label={hero.copyInstall}
              t={t.common.copy}
            />
          </div>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            [ {hero.viewSource} ]
            <span className="sr-only"> {t.common.newTab}</span>
          </a>
        </div>

        <HeroFilm film={HERO_FILM[locale]} t={hero.film} />

        <figure className={styles.panes} data-hero-fade>
          <figcaption className="sr-only">{hero.panesLabel}</figcaption>
          <div className={styles.pane} aria-hidden="true" data-pane-you>
            <div className={styles.paneTitle}>
              <span>── {hero.paneYou} ──</span>
              <span>zsh -i</span>
            </div>
            <div className={styles.paneBody}>
              <Cmd cmd="exec zsh" />
              {hero.bootLog.map((line) => (
                <div key={line.text} className={styles.bootLine} data-boot-line>
                  <span className={styles[line.status]}>
                    {STATUS_TAG[line.status]}
                  </span>{" "}
                  <span className={line.status === "ready" ? styles.bright : undefined}>
                    {line.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.pane} aria-hidden="true" data-pane-agent>
            <div className={styles.paneTitle}>
              <span>── {hero.paneAgent} ──</span>
              <span>CLAUDECODE=1</span>
            </div>
            <div className={styles.paneBody}>
              {AGENT_COMMANDS.map((step) => {
                const comment = hero.agentComments[step.id];
                return (
                  <div key={step.id} data-agent-step>
                    <Cmd cmd={step.cmd} />
                    <div className={styles.agentOut} data-agent-out>
                      {step.output}
                    </div>
                    {comment && (
                      <div className="comment" data-agent-out>
                        # {comment}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </figure>
      </HeroMotion>
    </section>
  );
}
