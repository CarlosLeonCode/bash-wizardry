"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Wrapper element; defaults to a div. */
  as?: ElementType;
  /** Elements to print, relative to this wrapper. Defaults to direct children. */
  selector?: string;
  stagger?: number;
  /** ScrollTrigger start position. */
  start?: string;
}

const LINE = 22; // approximate px per printed "line"

/**
 * "Terminal print" reveal: each target is uncovered top to bottom in a few
 * hard steps, like lines arriving on a slow tty.
 * Content is fully visible in the server HTML; GSAP only sets the hidden
 * state once it runs, and never when the user prefers reduced motion.
 */
export default function Reveal({
  children,
  className,
  as: Tag = "div",
  selector = ":scope > *",
  stagger = 0.08,
  start = "top 85%",
}: RevealProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = root.current;
        const targets = el
          ? Array.from(el.querySelectorAll<HTMLElement>(selector))
          : [];
        if (!el || !targets.length) return;

        gsap.set(targets, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: el,
          start,
          once: true,
          onEnter: () => {
            targets.forEach((target, i) => {
              const lines = Math.max(
                1,
                Math.min(12, Math.round(target.offsetHeight / LINE)),
              );
              gsap.fromTo(
                target,
                { autoAlpha: 1, clipPath: "inset(0 0 100% 0)" },
                {
                  clipPath: "inset(0 0 0% 0)",
                  duration: Math.min(0.06 * lines + 0.08, 0.55),
                  ease: `steps(${lines})`,
                  delay: i * stagger,
                  clearProps: "clipPath",
                },
              );
            });
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <Tag ref={root} className={className}>
      {children}
    </Tag>
  );
}
