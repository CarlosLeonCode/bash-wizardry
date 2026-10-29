import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, softReveal } from "../components/anim";
import type { Copy } from "../copy";
import stats from "../stats.generated.json";
import { COLOR, EASE_OUT, FONT_SANS } from "../theme";

export const Numbers: React.FC<{ copy: Copy }> = ({ copy }) => {
  const frame = useCurrentFrame();
  const items = [
    { value: stats.spells, label: copy.numbers.spells },
    { value: stats.modules, label: copy.numbers.modules },
    { value: 0, label: copy.numbers.binaries },
    { value: 0, label: copy.numbers.daemons },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", width: 1600 }}>
        {items.map((it, i) => {
          const at = 10 + i * 9;
          const count = Math.round(
            interpolate(frame, [at, at + 46], [0, it.value], { ...clamp, easing: EASE_OUT }),
          );
          return (
            <div
              key={it.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderLeft: i > 0 ? `1px solid rgba(255,255,255,${0.08 * softReveal(frame, at).opacity})` : "none",
              }}
            >
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 700,
                  fontSize: 168,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  color: COLOR.text,
                  fontVariantNumeric: "tabular-nums",
                  ...softReveal(frame, at, 30, 26, 14),
                }}
              >
                {count}
              </div>
              <div
                style={{
                  marginTop: 22,
                  fontFamily: FONT_SANS,
                  fontWeight: 500,
                  fontSize: 34,
                  letterSpacing: "-0.01em",
                  color: COLOR.muted,
                  ...softReveal(frame, at + 10, 26, 12, 8),
                }}
              >
                {it.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
