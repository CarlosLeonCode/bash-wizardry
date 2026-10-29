import React from "react";
import { AbsoluteFill } from "remotion";
import { Headline } from "../components/Headline";
import type { Copy } from "../copy";

export const Title: React.FC<{ copy: Copy }> = ({ copy }) => {
  const { line1, line2, size } = copy.title;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: size * 0.08 }}>
      <Headline segments={line1} at={14} size={size} />
      <Headline segments={line2} at={44} size={size} />
    </AbsoluteFill>
  );
};
