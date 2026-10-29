import React from "react";
import { AbsoluteFill } from "remotion";
import { COLOR } from "../theme";

// Near-black canvas with a very soft vignette. Rendered once, under every scene,
// so cross-fades never flash a different background.
export const Background: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.bg }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(255,255,255,0.025) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
