import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, softReveal } from "../components/anim";
import type { Copy } from "../copy";
import { COLOR, FONT_MONO, FONT_SANS } from "../theme";

const INSTALL =
  "curl -fsSL https://raw.githubusercontent.com/CarlosLeonCode/bash-wizardry/main/install.sh | bash";

export const EndCard: React.FC<{ copy: Copy; duration: number }> = ({ copy, duration }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [duration - 26, duration], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fade }}>
      <div
        style={{
          fontFamily: FONT_SANS,
          fontWeight: 700,
          fontSize: 148,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: COLOR.text,
          ...softReveal(frame, 6, 34, 26, 18),
        }}
      >
        bash<span style={{ color: COLOR.green }}>-</span>wizardry
      </div>

      <div
        style={{
          marginTop: 72,
          padding: "22px 36px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.035)",
          border: `1px solid ${COLOR.border}`,
          fontFamily: FONT_MONO,
          fontSize: 25,
          color: COLOR.text,
          whiteSpace: "pre",
          ...softReveal(frame, 30, 30, 16, 10),
        }}
      >
        <span style={{ color: COLOR.green }}>$ </span>
        {INSTALL}
      </div>

      <div
        style={{
          marginTop: 64,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          fontFamily: FONT_SANS,
          ...softReveal(frame, 52, 30, 14, 10),
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em", color: COLOR.text }}>
          bashwizardry.carlosleoncode.com
        </div>
        <div style={{ fontSize: 28, fontWeight: 500, color: COLOR.muted }}>
          github.com/CarlosLeonCode/bash-wizardry
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 72,
          fontFamily: FONT_SANS,
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: "0.01em",
          color: COLOR.faint,
          ...softReveal(frame, 74, 30, 8, 6),
        }}
      >
        {copy.endCard.footer}
      </div>
    </AbsoluteFill>
  );
};
