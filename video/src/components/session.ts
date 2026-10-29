import { COLOR } from "../theme";
import { hashString, seeded } from "./anim";

// A tiny, deterministic terminal "screenplay" compiler. Scenes describe what
// happens (prompt, typed command, output lines, an answered [y/N] prompt) and
// get back absolute frame times for every line and keystroke.

export type Span = { text: string; color?: string; weight?: number };

export type Line = {
  spans: Span[];
  at: number; // frame the line appears
  small?: boolean;
  // Text typed at the end of the line (command or prompt answer).
  typed?: { text: string; times: number[]; color?: string };
  input?: boolean; // the cursor may sit on this line
};

export type Session = { lines: Line[]; end: number };

export type Step =
  | { kind: "cmd"; prompt: Span[]; cmd: string; wait?: number; enter?: number; cps?: number }
  | {
      kind: "out";
      lines: (string | Span[])[];
      gap?: number;
      every?: number;
      small?: boolean;
      color?: string;
    }
  | { kind: "ask"; spans: Span[]; answer?: string; gap?: number; wait?: number; enter?: number }
  | { kind: "pause"; frames: number };

export const prompt = (path: string, symbol = "❯"): Span[] => [
  { text: path, color: COLOR.muted },
  { text: ` ${symbol} `, color: COLOR.green },
];

const typeTimes = (text: string, start: number, cps: number): number[] => {
  const rand = seeded(hashString(text) ^ start);
  const base = 30 / cps;
  const times: number[] = [];
  let t = start;
  for (const ch of Array.from(text)) {
    // Natural rhythm: jitter each keystroke, linger a touch around spaces.
    const jitter = 0.55 + rand() * 1.0;
    t += base * jitter + (ch === " " ? base * 0.6 : 0);
    times.push(Math.round(t));
  }
  return times;
};

export const compile = (steps: Step[], start = 0): Session => {
  const lines: Line[] = [];
  let t = start;
  for (const step of steps) {
    if (step.kind === "pause") {
      t += step.frames;
    } else if (step.kind === "cmd") {
      const at = t;
      const times = typeTimes(step.cmd, at + (step.wait ?? 14), step.cps ?? 20);
      lines.push({ spans: step.prompt, at, typed: { text: step.cmd, times }, input: true });
      t = (times[times.length - 1] ?? at) + (step.enter ?? 10);
    } else if (step.kind === "out") {
      t += step.gap ?? 4;
      const every = step.every ?? 4;
      step.lines.forEach((l, i) => {
        const spans = typeof l === "string" ? [{ text: l, color: step.color }] : l;
        lines.push({ spans, at: t + i * every, small: step.small });
      });
      t += Math.max(0, step.lines.length - 1) * every + 6;
    } else if (step.kind === "ask") {
      const at = t + (step.gap ?? 4);
      const answer = step.answer ?? "";
      const times = answer ? typeTimes(answer, at + (step.wait ?? 30), 12) : [];
      lines.push({
        spans: step.spans,
        at,
        input: true,
        typed: answer ? { text: answer, times, color: COLOR.text } : undefined,
      });
      t = (times[times.length - 1] ?? at) + (step.enter ?? 10);
    }
  }
  return { lines, end: t };
};
