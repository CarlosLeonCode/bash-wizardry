"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
// Client component: import locale config and types only, never the
// dictionaries (they would ship every locale's copy to the browser).
import {
  LOCALE_NAME,
  LOCALE_PATH,
  LOCALES,
  type Locale,
} from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { REPO_URL } from "@/lib/urls";
import styles from "./Navbar.module.css";

const SECTIONS = [
  "agents",
  "tour",
  "principles",
  "spellbook",
  "install",
] as const;

/** Vim/tmux-style scroll position: Top, Bot or a percentage. */
const position = (progress: number) =>
  progress < 0.01
    ? "Top"
    : progress > 0.99
      ? "Bot"
      : `${Math.round(progress * 100)}%`;

/**
 * Sticky header: the tmux status line and the prompt bar stay pinned to the
 * top at all times (the link strip above them scrolls away).
 */
export default function Navbar({
  locale,
  t,
  newTab,
  spellCount,
}: {
  locale: Locale;
  t: Dictionary["nav"];
  newTab: string;
  spellCount: number;
}) {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const percent = useRef<HTMLSpanElement>(null);
  const links = SECTIONS.map((id) => ({ label: t.links[id], href: `#${id}` }));

  useGSAP(
    () => {
      // Scroll progress (all users): a thin bar plus the tmux position label.
      // Both are written straight to the DOM, never through React state.
      const setProgress = gsap.quickSetter(progress.current, "scaleX");
      let label = "";
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          setProgress(self.progress);
          const next = position(self.progress);
          if (next !== label && percent.current) {
            label = next;
            percent.current.textContent = next;
          }
        },
      });

      // Highlight the link of the section in the middle of the viewport.
      const navLinks = gsap.utils.toArray<HTMLAnchorElement>(
        "[data-nav-link]",
        header.current,
      );
      navLinks.forEach((link) => {
        const section = document.querySelector(link.hash);
        if (!section) return;
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            link.classList.toggle(styles.active, self.isActive);
            if (self.isActive) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          },
        });
      });
    },
    { scope: header },
  );

  // Mobile menu: print the links in when opened.
  useGSAP(
    () => {
      if (!open || !window.matchMedia(MOTION_OK).matches) return;
      gsap.from("[data-menu-item]", {
        autoAlpha: 0,
        x: -6,
        duration: 0.25,
        stagger: 0.04,
        ease: "steps(3)",
      });
    },
    { scope: header, dependencies: [open] },
  );

  // Close the menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div ref={progress} className={styles.progress} aria-hidden="true" />
      <header
        ref={header}
        className={styles.header}
        data-open={open || undefined}
      >
        <div className={styles.topbar} aria-hidden="true">
          <div className={styles.windows}>
            <span className={styles.session}>[bash-wizardry]</span>
            <span className={`${styles.window} ${styles.current}`}>0:zsh*</span>
            <span className={`${styles.window} ${styles.wide}`}>1:bwiz</span>
            <span className={`${styles.window} ${styles.wide}`}>2:docs</span>
          </div>
          <div className={styles.status}>
            <span className={styles.wide}>agent:stealth │ </span>
            {spellCount} {t.spells} │ <span ref={percent}>Top</span>
          </div>
        </div>

        <div className={styles.bar}>
          <a href="#top" className={`${styles.brand} glow`}>
            <span aria-hidden="true">root@wizardry:~#</span>
            <span className="sr-only">{t.home}</span>
          </a>

          <nav aria-label={t.primary} className={styles.desktopNav}>
            <ul className={styles.links}>
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={styles.link} data-nav-link>
                    <span className={styles.dot} aria-hidden="true">
                      ./
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.right}>
            <nav aria-label={t.language} className={styles.lang}>
              <span className={styles.langLabel} aria-hidden="true">
                lang:
              </span>
              <ul className={styles.langList}>
                {LOCALES.map((code) => {
                  const current = code === locale;
                  return (
                    <li key={code}>
                      <a
                        href={LOCALE_PATH[code]}
                        hrefLang={code}
                        lang={code}
                        aria-label={LOCALE_NAME[code]}
                        aria-current={current ? "page" : undefined}
                        className={styles.langLink}
                      >
                        {current ? `[${code}]` : code}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.github}
            >
              [ github <span aria-hidden="true">↗</span> ]
              <span className="sr-only"> {newTab}</span>
            </a>
            <button
              type="button"
              className={styles.menuButton}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? `[ ${t.close} ]` : `[ ${t.menu} ]`}
            </button>
          </div>
        </div>

        <nav
          id="mobile-menu"
          aria-label={t.mobile}
          className={styles.mobileNav}
          hidden={!open}
        >
          <ul>
            {links.map((link) => (
              <li key={link.href} data-menu-item>
                <a href={link.href} onClick={() => setOpen(false)}>
                  <span className={styles.dot} aria-hidden="true">
                    ./
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
            <li data-menu-item>
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
                github <span aria-hidden="true">↗</span>
                <span className="sr-only"> {newTab}</span>
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
