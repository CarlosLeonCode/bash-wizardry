// Single place where GSAP plugins are registered. Import gsap and its plugins
// from here (client components only) so registration happens exactly once.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
}

/** Media query for users who did not ask for reduced motion. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Media query for wide viewports, used for desktop-only effects. */
export const DESKTOP = "(min-width: 1024px)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
