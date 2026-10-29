import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cursor } from "../components/Terminal";
import { clamp, progress, softReveal } from "../components/anim";
import type { Copy } from "../copy";
import { COLOR, EASE_IN_OUT, FONT_MONO, FONT_SANS } from "../theme";

// The long incantations people retype every day. Layered at different sizes and
// opacities, each drifting at its own speed for a light parallax.
const COMMANDS = [
  { text: "git pull --rebase && git push", x: -260, y: 352, size: 40, op: 0.75, drift: 34 },
  {
    text: "docker exec -it $(docker ps -q --filter name=api) /bin/bash",
    x: 90,
    y: 470,
    size: 34,
    op: 0.55,
    drift: -46,
  },
  { text: "pnpm run dev  # or was it yarn? npm?", x: -120, y: 588, size: 38, op: 0.7, drift: 26 },
  {
    text: "git branch --merged | grep -v main | xargs git branch -d",
    x: 150,
    y: 700,
    size: 32,
    op: 0.45,
    drift: -30,
  },
];

const COLLAPSE = 124;

export const Problem: React.FC<{ copy: Copy; duration: number }> = ({ copy, duration }) => {
  const frame = useCurrentFrame();
  const cursorIn = progress(frame, COLLAPSE + 34, 18);
  const blink = frame < COLLAPSE + 60 || Math.floor((frame - COLLAPSE - 60) / 15) % 2 === 0;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 112,
          fontFamily: FONT_SANS,
          fontWeight: 600,
          fontSize: 52,
          letterSpacing: "-0.02em",
          color: COLOR.text,
          ...softReveal(frame, 6, 26, 14, 12),
          opacity: softReveal(frame, 6).opacity * interpolate(frame, [COLLAPSE, COLLAPSE + 24], [1, 0.0], clamp),
        }}
      >
        {copy.problem.caption}
      </div>

      {COMMANDS.map((c, i) => {
        const appear = 20 + i * 14;
        const r = progress(frame, appear, 30);
        const t = interpolate(frame, [appear, duration], [0, 1], clamp);
        const m = interpolate(frame, [COLLAPSE + i * 4, COLLAPSE + i * 4 + 34], [0, 1], {
          ...clamp,
          easing: EASE_IN_OUT,
        });
        const cx = c.x + c.drift * t;
        const dx = -cx * m;
        const dy = (540 - c.y) * m;
        return (
          <div
            key={c.text}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: c.y,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                transform: `translate(${cx + dx}px, calc(-50% + ${dy + (1 - r) * 20}px)) scale(${1 - 0.92 * m})`,
                opacity: c.op * r * (1 - m),
                filter: `blur(${(1 - r) * 10 + m * 18}px)`,
                fontFamily: FONT_MONO,
                fontSize: c.size,
                color: COLOR.muted,
                whiteSpace: "pre",
              }}
            >
              {c.text}
            </div>
          </div>
        );
      })}

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            opacity: cursorIn,
            transform: `scale(${0.6 + 0.4 * cursorIn})`,
            filter: cursorIn >= 1 ? "none" : `blur(${(1 - cursorIn) * 8}px)`,
          }}
        >
          <Cursor size={72} visible={blink} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
