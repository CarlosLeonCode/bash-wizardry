// Single source of truth for scene timing (frames at 30 fps).
// Scenes overlap by XFADE frames so each one cross-fades into the next.
// Beats are aligned to a 120 BPM grid (1 beat = 15 frames, 1 bar = 60 frames)
// so a 72 s music bed can be dropped in later without retiming.

export const XFADE = 12;

export const SCENES = [
  { id: "cold-open", from: 0, duration: 120 },
  { id: "title", from: 120, duration: 150 },
  { id: "problem", from: 270, duration: 210 },
  { id: "one-spell", from: 480, duration: 300 },
  { id: "workspaces", from: 780, duration: 330 },
  { id: "asks-first", from: 1110, duration: 180 },
  { id: "agents", from: 1290, duration: 360 },
  { id: "make-it-yours", from: 1650, duration: 180 },
  { id: "numbers", from: 1830, duration: 135 },
  { id: "end-card", from: 1965, duration: 195 },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];

const last = SCENES[SCENES.length - 1];
export const TOTAL_FRAMES = last.from + last.duration;
