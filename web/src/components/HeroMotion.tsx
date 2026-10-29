"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Intro choreography for the hero. Everything is server-rendered and visible;
 * GSAP only hides things once it runs, and never for reduced motion.
 *
 * Markup contract (set by HeroSection):
 *   [data-logo] / [data-logo-art]   ASCII logo: decode on load, glitch on hover
 *   [data-hero-text]                headline text, typed char by char
 *   [data-hero-cursor]              resting block cursor after the headline
 *   [data-hero-typing-cursor]       cursor that follows the typing
 *   [data-hero-fade]                lead, install row and panes
 *   [data-pane-you] [data-boot-line] [data-cmd-line] [data-cmd]
 *   [data-pane-agent] [data-agent-step] [data-agent-out]
 */

const TYPE_SPEED = 0.034; // headline, seconds per character
const CMD_SPEED = 0.045; // pane commands, seconds per character
const DECODE_TIME = 0.8;
// Only glyphs the logo already uses, plus ASCII, so widths never change.
const GLYPHS = "█╔╗╚╝═║#$%&@";
const FINE_POINTER = "(hover: hover) and (pointer: fine)";
// Irregular gaps between boot lines read like a real shell starting up.
const BOOT_JITTER = [0.14, 0.06, 0.09, 0.05, 0.11, 0.07, 0.05, 0.12, 0.08, 0.16, 0.1, 0.18];

export default function HeroMotion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, (context) => {
        const el = root.current;
        if (!el) return;
        const q = gsap.utils.selector(el);

        decodeLogo(q<HTMLElement>("[data-logo-art]"));

        gsap.from(q("[data-hero-fade]"), {
          autoAlpha: 0,
          y: 12,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.9,
        });

        // Hide the headline right away; type it once the web font is ready so
        // character positions are measured with the final metrics.
        const text = q<HTMLElement>("[data-hero-text]")[0];
        const restCursor = q<HTMLElement>("[data-hero-cursor]")[0];
        const typingCursor = q<HTMLElement>("[data-hero-typing-cursor]")[0];
        const title = el.querySelector<HTMLElement>("[data-hero-title]");
        if (text && title && typingCursor && restCursor) {
          gsap.set(text, { autoAlpha: 0 });
          gsap.set(restCursor, { visibility: "hidden" });
          let cancelled = false;
          document.fonts.ready.then(() => {
            if (cancelled) return;
            context.add(() =>
              typeHeadline(title, text, restCursor, typingCursor),
            );
          });
          context.add(() => () => {
            cancelled = true;
          });
        }

        panes(q);
      });

      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const logo = root.current?.querySelector<HTMLElement>("[data-logo]");
        if (!logo) return;
        const arts = logo.querySelectorAll<HTMLElement>("[data-logo-art]");
        let glitch: gsap.core.Timeline | null = null;
        const onEnter = () => {
          if (glitch?.isActive()) return;
          glitch = gsap
            .timeline()
            .to(arts, {
              x: -3,
              skewX: 6,
              textShadow:
                "-2px 0 rgba(255, 77, 94, 0.8), 2px 0 rgba(77, 215, 255, 0.8)",
              duration: 0.05,
              ease: "none",
            })
            .to(arts, { x: 3, skewX: -3, duration: 0.05, ease: "none" })
            .to(arts, { x: -1, skewX: 0, duration: 0.04, ease: "none" })
            .to(arts, { x: 0, clearProps: "transform,textShadow", duration: 0.06 });
        };
        logo.addEventListener("pointerenter", onEnter);
        return () => logo.removeEventListener("pointerenter", onEnter);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}

/**
 * Scramble the visible logo's block characters and resolve them left to
 * right. Writes to the existing text node, so React keeps its reference.
 */
function decodeLogo(arts: HTMLElement[]) {
  arts.forEach((art) => {
    if (art.offsetParent === null) return; // hidden variant
    const node = art.firstChild;
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const original = node.nodeValue ?? "";
    const lines = original.split("\n");
    const width = Math.max(...lines.map((line) => line.length));
    const state = { col: 0 };
    let lastCol = -1;

    gsap.to(state, {
      col: width + 6,
      duration: DECODE_TIME,
      ease: "power1.inOut",
      onUpdate: () => {
        const col = Math.floor(state.col);
        if (col === lastCol) return;
        lastCol = col;
        node.nodeValue = lines
          .map((line) =>
            Array.from(line, (ch, i) =>
              ch === " " || i < col
                ? ch
                : GLYPHS[(Math.random() * GLYPHS.length) | 0],
            ).join(""),
          )
          .join("\n");
      },
      onComplete: () => {
        node.nodeValue = original;
      },
      onInterrupt: () => {
        node.nodeValue = original;
      },
    });
  });
}

/** Type the headline char by char with a block cursor riding the last char. */
function typeHeadline(
  title: HTMLElement,
  text: HTMLElement,
  restCursor: HTMLElement,
  typingCursor: HTMLElement,
) {
  const split = SplitText.create(text, { type: "words,chars" });
  const chars = split.chars as HTMLElement[];
  if (!chars.length) {
    split.revert();
    gsap.set(text, { autoAlpha: 1 });
    gsap.set(restCursor, { clearProps: "visibility" });
    return;
  }

  // One layout read up front; the timeline only writes transforms.
  const base = title.getBoundingClientRect();
  const stops = chars.map((char) => {
    const r = char.getBoundingClientRect();
    return { x: r.right - base.left, y: r.top - base.top + r.height * 0.1 };
  });
  const first = chars[0].getBoundingClientRect();

  gsap.set(text, { autoAlpha: 1 });
  gsap.set(chars, { autoAlpha: 0 });
  gsap.set(typingCursor, {
    display: "block",
    x: first.left - base.left,
    y: stops[0].y,
  });

  const tl = gsap.timeline({
    delay: 0.2,
    onComplete: () => {
      gsap.set(typingCursor, { display: "none" });
      gsap.set(restCursor, { clearProps: "visibility" });
      // Give the text back to the browser so it reflows freely on resize.
      split.revert();
    },
  });
  let at = 0;
  chars.forEach((char, i) => {
    // A small pause after the comma, like a human typing.
    at += char.textContent === "," ? TYPE_SPEED * 6 : TYPE_SPEED;
    tl.set(char, { autoAlpha: 1 }, at).set(typingCursor, stops[i], at);
  });
  return tl;
}

/** Pane 0 boots line by line, then pane 1 types its commands. */
function panes(q: (selector: string) => HTMLElement[]) {
  const youCmd = q("[data-pane-you] [data-cmd]")[0];
  const youPrompt = q("[data-pane-you] [data-cmd-line]")[0];
  const bootLines = q("[data-boot-line]");
  const agentSteps = q("[data-agent-step]");
  if (!youCmd || !youPrompt) return;

  gsap.set([youPrompt, ...bootLines, ...agentSteps], { autoAlpha: 0 });

  const tl = gsap.timeline({ delay: 1.35 });
  typeInto(tl, youPrompt, youCmd);
  bootLines.forEach((line, i) => {
    tl.set(line, { autoAlpha: 1 }, `+=${BOOT_JITTER[i % BOOT_JITTER.length]}`);
  });

  tl.to({}, { duration: 0.35 });
  agentSteps.forEach((step) => {
    const prompt = step.querySelector<HTMLElement>("[data-cmd-line]");
    const cmd = step.querySelector<HTMLElement>("[data-cmd]");
    const outs = step.querySelectorAll<HTMLElement>("[data-agent-out]");
    if (!prompt || !cmd) return;
    tl.set(step, { autoAlpha: 1 });
    gsap.set(outs, { autoAlpha: 0 });
    typeInto(tl, prompt, cmd);
    tl.to(outs, {
      autoAlpha: 1,
      duration: 0.12,
      stagger: 0.18,
      ease: "none",
    }, "+=0.2").to({}, { duration: 0.4 });
  });
}

/** Monospace font: 1ch == one character, so a stepped width reads as typing. */
function typeInto(
  tl: gsap.core.Timeline,
  prompt: HTMLElement,
  cmd: HTMLElement,
) {
  const chars = cmd.dataset.cmd?.length ?? 0;
  gsap.set(cmd, { width: "0ch" });
  tl.set(prompt, { autoAlpha: 1 }).to(
    cmd,
    {
      width: `${chars}ch`,
      duration: chars * CMD_SPEED,
      ease: `steps(${Math.max(chars, 1)})`,
    },
    "+=0.25",
  ).set(cmd, { clearProps: "width" });
}
