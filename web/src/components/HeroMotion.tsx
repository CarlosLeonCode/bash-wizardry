"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Intro choreography for the hero: masked word reveal on the headline
 * (SplitText), then a stagger on the supporting copy, CTAs and terminal.
 *
 * Markup contract (set by HeroSection):
 *   [data-hero-title]     the h1 to split
 *   [data-hero-gradient]  the gradient phrase inside the h1
 *   [data-hero-fade]      elements that fade up after the headline
 */
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

      mm.add(MOTION_OK, () => {
        const title =
          root.current?.querySelector<HTMLElement>("[data-hero-title]");
        const fades =
          root.current?.querySelectorAll<HTMLElement>("[data-hero-fade]");
        if (!title) return;

        gsap.from(fades ?? [], {
          autoAlpha: 0,
          y: 18,
          duration: 0.9,
          stagger: 0.09,
          delay: 0.45,
        });

        SplitText.create(title, {
          type: "words",
          mask: "words",
          wordsClass: "hero-word",
          autoSplit: true,
          onSplit(self) {
            paintGradientWords(title);
            return gsap.from(self.words, {
              yPercent: 110,
              duration: 1,
              stagger: 0.06,
              ease: "expo.out",
            });
          },
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

/**
 * background-clip: text does not paint through the transformed word wrappers
 * SplitText creates, so each gradient word gets its own slice of one shared
 * gradient, sized and offset to the phrase so it still reads as one sweep.
 */
function paintGradientWords(title: HTMLElement) {
  const phrase = title.querySelector<HTMLElement>("[data-hero-gradient]");
  if (!phrase) return;
  const words = Array.from(phrase.querySelectorAll<HTMLElement>(".hero-word"));
  if (!words.length) return;
  // Measure the words themselves: an inline span wrapping inline-blocks does
  // not report a reliable box of its own.
  const rects = words.map((word) => word.getBoundingClientRect());
  const left = Math.min(...rects.map((r) => r.left));
  const width = Math.max(...rects.map((r) => r.right)) - left;
  phrase.style.background = "none";
  words.forEach((word, i) => {
    const styles: Record<string, string> = {
      "background-image": "var(--gradient)",
      "background-size": `${width}px 100%`,
      "background-position": `${left - rects[i].left}px 0`,
      "background-repeat": "no-repeat",
      "-webkit-background-clip": "text",
      "background-clip": "text",
      "-webkit-text-fill-color": "transparent",
    };
    for (const [prop, value] of Object.entries(styles)) {
      word.style.setProperty(prop, value);
    }
  });
}
