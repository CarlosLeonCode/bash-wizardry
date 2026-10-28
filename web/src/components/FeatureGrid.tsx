"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Grid wrapper for the principle cards: batched, staggered scroll reveal and a
 * pointer-following glow (CSS variables read by the card's ::before).
 */
export default function FeatureGrid({
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
      mm.add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>(
          "[data-card]",
          root.current,
        );
        gsap.set(cards, { autoAlpha: 0, y: 32 });
        ScrollTrigger.batch(cards, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.08,
              overwrite: true,
            }),
        });
      });
    },
    { scope: root },
  );

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const card = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-card]",
    );
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <div ref={root} className={className} onPointerMove={handlePointerMove}>
      {children}
    </div>
  );
}
