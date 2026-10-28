"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { REPO_URL } from "@/lib/content";
import { GitHubIcon } from "@/components/icons";
import styles from "./Navbar.module.css";

const links = [
  { label: "Tour", href: "#tour" },
  { label: "Principles", href: "#features" },
  { label: "Spellbook", href: "#spellbook" },
  { label: "Install", href: "#install" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Scroll progress bar (all users) + hide on scroll down / show on scroll up.
  useGSAP(
    () => {
      const setProgress = gsap.quickSetter(progress.current, "scaleX");
      const mm = gsap.matchMedia();

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => setProgress(self.progress),
      });

      mm.add(MOTION_OK, () => {
        const hide = gsap.to(header.current, {
          yPercent: -100,
          duration: 0.35,
          ease: "power2.out",
          paused: true,
        });

        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const pastHero = self.scroll() > 160;
            // Keep the bar visible while a keyboard user is focused inside it.
            const focused = header.current?.querySelector(":focus-visible");
            if (
              self.direction === 1 &&
              pastHero &&
              !openRef.current &&
              !focused
            ) {
              hide.play();
            } else if (self.direction === -1 || !pastHero) {
              hide.reverse();
            }
          },
        });
      });
    },
    { scope: header },
  );

  // Mobile menu: animate links in when opened.
  useGSAP(
    () => {
      if (!open || !window.matchMedia(MOTION_OK).matches) return;
      gsap.from("[data-menu-item]", {
        autoAlpha: 0,
        y: -8,
        duration: 0.35,
        stagger: 0.04,
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
        <div className={`container ${styles.bar}`}>
          <a
            href="#top"
            className={styles.logo}
            aria-label="bash-wizardry home"
          >
            <span aria-hidden="true">🧙‍♂️</span>
            <span>bash-wizardry</span>
          </a>

          <nav aria-label="Primary" className={styles.desktopNav}>
            <ul className={styles.links}>
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.right}>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-secondary ${styles.github}`}
            >
              <GitHubIcon />
              <span>GitHub</span>
            </a>
            <button
              type="button"
              className={styles.menuButton}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              <span className={styles.menuIcon} aria-hidden="true" />
            </button>
          </div>
        </div>

        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className={styles.mobileNav}
          hidden={!open}
        >
          <ul className="container">
            {links.map((link) => (
              <li key={link.href} data-menu-item>
                <a href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li data-menu-item>
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
