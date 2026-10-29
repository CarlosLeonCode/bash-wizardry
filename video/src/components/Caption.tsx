import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, EASE_IN_OUT, FONT_SANS } from "../theme";
import { clamp, softReveal } from "./anim";

type Props = {
  text: string;
  at?: number;
  // If set, the caption first appears large and centred, then settles to the
  // top of the frame at this frame. Otherwise it appears directly at the top.
  settleAt?: number;
  size?: number;
  maxBig?: number;
  topY?: number;
  color?: string;
};

// Approximate Inter 600 advance (em per char, tight tracking) used only to keep
// long Spanish captions inside the frame.
const EM_PER_CHAR = 0.52;
const MAX_WIDTH = 1640;

export const fitSize = (text: string, max: number, width = MAX_WIDTH) =>
  Math.min(max, Math.floor(width / (Array.from(text).length * EM_PER_CHAR)));

export const Caption: React.FC<Props> = ({
  text,
  at = 0,
  settleAt,
  size = 52,
  maxBig = 104,
  topY = 118,
  color = COLOR.text,
}) => {
  const frame = useCurrentFrame();
  const finalSize = fitSize(text, size);
  const big = settleAt === undefined ? finalSize : Math.max(finalSize, fitSize(text, maxBig));
  const move =
    settleAt === undefined
      ? 1
      : interpolate(frame, [settleAt, settleAt + 28], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const y = interpolate(move, [0, 1], [540, topY]);
  const scale = interpolate(move, [0, 1], [1, finalSize / big]);
  const r = softReveal(frame, at, 26, 18, 14);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: `translateY(-50%) scale(${scale})`,
          transformOrigin: "50% 50%",
        }}
      >
        <div
          style={{
            ...r,
            fontFamily: FONT_SANS,
            fontWeight: 600,
            fontSize: big,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color,
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
