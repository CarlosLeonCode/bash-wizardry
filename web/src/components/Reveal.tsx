"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Elements to animate, relative to this wrapper. Defaults to direct children. */
  selector?: string;
  stagger?: number;
  y?: number;
  /** ScrollTrigger start position. */
  start?: string;
}

/**
 * Fades and lifts its content in when it scrolls into view.
 * Content is fully visible in the server HTML; GSAP only sets the hidden
 * state once it runs, and never when the user prefers reduced motion.
 */
export default function Reveal({
  children,
  className,
  selector = ":scope > *",
  stagger = 0.08,
  y = 24,
  start = "top 85%",
}: RevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const targets = root.current?.querySelectorAll(selector);
        if (!targets?.length) return;
        gsap.from(targets, {
          autoAlpha: 0,
          y,
          stagger,
          duration: 0.9,
          scrollTrigger: { trigger: root.current, start, once: true },
        });
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
