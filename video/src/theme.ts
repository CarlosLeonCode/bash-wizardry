import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { Easing } from "remotion";

const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
});
const mono = loadMono("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin", "latin-ext"],
});

// System emoji font as the last fallback so real script output (✨ ⚠️ ✅ 🪄 🧙‍♂️)
// renders the way it does in a macOS terminal.
const emoji = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"';

export const FONT_SANS = `${inter.fontFamily}, -apple-system, "Helvetica Neue", sans-serif, ${emoji}`;
export const FONT_MONO = `${mono.fontFamily}, "SF Mono", Menlo, monospace, ${emoji}`;

export const COLOR = {
  bg: "#050605",
  text: "#F5F7F5",
  muted: "#8C968E",
  faint: "#4A524C",
  green: "#39FF6A",
  amber: "#FFB000",
  window: "#0B0E0C",
  border: "rgba(255,255,255,0.08)",
} as const;

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Slow, confident easings. No bounces anywhere.
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.55, 0, 0.75, 0);

export const SPRING_CALM = { damping: 200, mass: 1, stiffness: 60 } as const;
