import React from "react";
import { useCurrentFrame } from "remotion";
import type { Segment } from "../copy";
import { COLOR, FONT_SANS } from "../theme";
import { softReveal } from "./anim";

type Props = {
  segments: Segment[];
  at: number;
  size: number;
  stagger?: number;
  color?: string;
  weight?: number;
};

// One line of large type, revealed word by word (fade + rise + blur).
export const Headline: React.FC<Props> = ({
  segments,
  at,
  size,
  stagger = 7,
  color = COLOR.text,
  weight = 700,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: FONT_SANS,
        fontWeight: weight,
        fontSize: size,
        letterSpacing: "-0.03em",
        lineHeight: 1.04,
        color,
        whiteSpace: "nowrap",
        display: "flex",
        justifyContent: "center",
        gap: `0 ${size * 0.26}px`,
      }}
    >
      {segments.map((s, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            color: s.accent ? COLOR.green : undefined,
            ...softReveal(frame, at + i * stagger, 30, size * 0.22, 16),
          }}
        >
          {s.text}
        </span>
      ))}
    </div>
  );
};

export const words = (text: string): Segment[] => text.split(" ").map((t) => ({ text: t }));
