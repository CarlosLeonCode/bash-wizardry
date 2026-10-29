import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import { progress, softReveal } from "../components/anim";
import type { Copy } from "../copy";
import { COLOR, FONT_MONO, FONT_SANS } from "../theme";

const SIZE = 46;
const CH = SIZE * 0.6; // JetBrains Mono advance
const ROW = SIZE * 1.75;
const TREE_AT = 42;
const STEP = 12;
const LINE = "rgba(255,255,255,0.18)";

type Row = { depth: number; name: string; dir?: boolean; highlight?: boolean };
const ROWS: Row[] = [
  { depth: 0, name: "~/.config/bash-wizardry/", dir: true },
  { depth: 1, name: "config.env" },
  { depth: 1, name: "modules/", dir: true },
  { depth: 2, name: "my-team.sh", highlight: true },
];

// x where a row's name starts, and where its children's trunk is drawn.
const nameX = (depth: number) => depth * CH * 3.5;
const trunkX = (depth: number) => nameX(depth) + CH * 0.5;

export const MakeItYours: React.FC<{ copy: Copy }> = ({ copy }) => {
  const frame = useCurrentFrame();
  const rowAt = (i: number) => TREE_AT + i * STEP;
  const hl = progress(frame, rowAt(ROWS.length) + 4, 24);
  const overrideAt = rowAt(ROWS.length) + 22;
  const width = nameX(0) + Array.from(ROWS[0].name).length * CH;

  // Vertical trunks grow down from the parent to its last child.
  const trunks = [
    { x: trunkX(0), from: 0, to: 2, at: rowAt(1) - 6 },
    { x: trunkX(1), from: 2, to: 3, at: rowAt(3) - 6 },
  ];

  return (
    <AbsoluteFill>
      <Caption text={copy.makeItYours.caption} at={2} settleAt={30} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 40 }}>
        <div style={{ position: "relative", width, height: ROW * ROWS.length }}>
          {trunks.map((t) => {
            const p = progress(frame, t.at, 22);
            const top = t.from * ROW + ROW * 0.82;
            const full = t.to * ROW + ROW / 2 - top;
            return (
              <div
                key={t.x}
                style={{
                  position: "absolute",
                  left: t.x,
                  top,
                  width: 2,
                  height: full * p,
                  background: LINE,
                }}
              />
            );
          })}
          {ROWS.map((r, i) => {
            const at = rowAt(i);
            const p = progress(frame, at, 22);
            const branch = progress(frame, at - 2, 14);
            return (
              <React.Fragment key={r.name}>
                {r.depth > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      left: trunkX(r.depth - 1),
                      top: i * ROW + ROW / 2,
                      width: (nameX(r.depth) - trunkX(r.depth - 1) - CH * 0.95) * branch,
                      height: 2,
                      background: LINE,
                    }}
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    left: nameX(r.depth),
                    top: i * ROW,
                    height: ROW,
                    lineHeight: `${ROW}px`,
                    fontFamily: FONT_MONO,
                    fontSize: SIZE,
                    whiteSpace: "pre",
                    color: r.highlight
                      ? interpolateColors(hl, [0, 1], [COLOR.text, COLOR.green])
                      : r.dir
                        ? COLOR.muted
                        : COLOR.text,
                    opacity: p,
                    transform: `translateX(${(1 - p) * 14}px)`,
                    filter: p >= 1 ? "none" : `blur(${(1 - p) * 6}px)`,
                  }}
                >
                  {r.highlight && (
                    <span
                      style={{
                        position: "absolute",
                        left: -16,
                        right: -16,
                        top: (ROW - SIZE * 1.45) / 2,
                        height: SIZE * 1.45,
                        borderRadius: 12,
                        background: "rgba(57,255,106,0.09)",
                        border: "1px solid rgba(57,255,106,0.30)",
                        opacity: hl,
                      }}
                    />
                  )}
                  <span style={{ position: "relative" }}>{r.name}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 72,
            fontFamily: FONT_SANS,
            fontWeight: 500,
            fontSize: 38,
            letterSpacing: "-0.01em",
            color: COLOR.muted,
            ...softReveal(frame, overrideAt, 26, 14, 10),
          }}
        >
          {copy.makeItYours.override}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
