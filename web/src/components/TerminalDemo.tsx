"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { TerminalSession } from "@/lib/content";
import styles from "./TerminalDemo.module.css";

interface TerminalDemoProps {
  session: TerminalSession;
  /** "mount" plays right away; "scroll" plays when the terminal enters the viewport. */
  trigger?: "mount" | "scroll";
  /** Seconds to wait before typing starts. */
  delay?: number;
}

const TYPE_SPEED = 0.055; // seconds per character
const OUTPUT_STAGGER = 0.09;

function Prompt({ cwd }: { cwd: string }) {
  return (
    <>
      <span className={styles.cwd}>{cwd}</span>
      <span className={styles.arrow}>❯</span>
    </>
  );
}

/**
 * Fake terminal that "types" its session with a GSAP timeline.
 *
 * The full transcript is server-rendered, so it is readable without JS and
 * reserves its final height (no layout shift). GSAP hides the lines and plays
 * them back; with reduced motion nothing is hidden at all.
 */
export default function TerminalDemo({
  session,
  trigger = "scroll",
  delay = 0,
}: TerminalDemoProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const steps = q<HTMLElement>("[data-step]");
        const idle = q<HTMLElement>("[data-idle]");

        gsap.set([q("[data-prompt]"), idle], { autoAlpha: 0 });
        gsap.set(q("[data-out]"), { autoAlpha: 0, y: 4 });

        const tl = gsap.timeline({ paused: true, delay });

        steps.forEach((step) => {
          const prompt = step.querySelector<HTMLElement>("[data-prompt]");
          const cmd = step.querySelector<HTMLElement>("[data-cmd]");
          const caret = step.querySelector<HTMLElement>("[data-caret]");
          const outs = step.querySelectorAll<HTMLElement>("[data-out]");
          const chars = cmd?.dataset.cmd?.length ?? 0;
          const hold = Number(step.dataset.hold ?? 0.7);

          // Monospace font: 1ch == 1 character, so a stepped width reads as typing.
          if (cmd) gsap.set(cmd, { width: "0ch" });

          tl.set(prompt, { autoAlpha: 1 })
            .set(caret, { autoAlpha: 1 })
            .to(
              cmd,
              {
                width: `${chars}ch`,
                duration: chars * TYPE_SPEED,
                ease: `steps(${Math.max(chars, 1)})`,
              },
              "+=0.35",
            )
            .set(caret, { autoAlpha: 0 }, "+=0.3")
            .to(outs, {
              autoAlpha: 1,
              y: 0,
              duration: 0.2,
              stagger: OUTPUT_STAGGER,
              ease: "power1.out",
            })
            .to({}, { duration: hold });
        });

        tl.set(idle, { autoAlpha: 1 });

        if (trigger === "mount") {
          tl.play();
        } else {
          ScrollTrigger.create({
            trigger: root.current,
            start: "top 75%",
            once: true,
            onEnter: () => tl.play(),
          });
        }
      });
    },
    { scope: root },
  );

  return (
    <figure className={styles.wrapper} ref={root}>
      <figcaption className="sr-only">{session.label}</figcaption>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.window} aria-hidden="true">
        <div className={styles.header}>
          <span className={styles.dots}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </span>
          <span className={styles.title}>{session.title}</span>
        </div>

        <div className={styles.content}>
          {session.steps.map((step, i) => (
            <div
              key={i}
              className={styles.step}
              data-step
              data-hold={step.hold}
            >
              <div className={styles.promptLine} data-prompt>
                <Prompt cwd={step.cwd} />
                <span className={styles.cmd} data-cmd={step.cmd}>
                  {step.cmd}
                </span>
                <span
                  className={`${styles.caret} ${styles.typingCaret}`}
                  data-caret
                />
              </div>
              {step.output.map((line, j) => (
                <div
                  key={j}
                  className={`${styles.out} ${styles[line.tone ?? "plain"]}`}
                  data-out
                >
                  {line.text}
                </div>
              ))}
            </div>
          ))}

          <div className={styles.promptLine} data-idle>
            <Prompt cwd={session.finalCwd} />
            <span className={styles.caret} />
          </div>
        </div>
      </div>
    </figure>
  );
}
