import { interpolate } from "remotion";
import { EASE_OUT } from "../theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 0 -> 1 progress between two frames with the house easing.
export const progress = (frame: number, start: number, duration: number, easing = EASE_OUT) =>
  interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing });

// Soft "blur-in" reveal used for every headline, caption and window.
export const softReveal = (frame: number, start: number, duration = 24, rise = 24, blur = 12) => {
  const p = progress(frame, start, duration);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * rise}px)`,
    filter: p >= 1 ? "none" : `blur(${(1 - p) * blur}px)`,
  } as const;
};

// Deterministic PRNG (mulberry32) so typing rhythm is identical on every render.
export const seeded = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const hashString = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
