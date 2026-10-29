import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cursor } from "../components/Terminal";
import { clamp } from "../components/anim";
import { COLOR, FONT_MONO } from "../theme";

const WORD = "bash-wizardry";
const SIZE = 76;
const TYPE_START = 54;
// Hand-tuned keystroke gaps (frames): a confident, human rhythm.
const GAPS = [0, 4, 3, 4, 6, 3, 3, 4, 3, 3, 4, 3, 4];
const TIMES = GAPS.reduce<number[]>((acc, g, i) => [...acc, (acc[i - 1] ?? TYPE_START) + g], []);

// Pure black, a cursor blinks twice, then types the name. Hold.
export const ColdOpen: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const typed = TIMES.filter((t) => frame >= t).length;
  const lastKey = TIMES[typed - 1] ?? -100;

  // Two blinks before typing: on 10-22, off 22-32, on 32-44, off 44-54.
  let visible: boolean;
  if (frame < TYPE_START) {
    visible = (frame >= 10 && frame < 22) || (frame >= 32 && frame < 44);
  } else if (frame - lastKey < 12 || typed < WORD.length) {
    visible = true;
  } else {
    visible = Math.floor((frame - lastKey) / 15) % 2 === 1;
  }

  // As the shot hands over to the title, the word softly dissolves.
  const out = interpolate(frame, [duration - 14, duration + 12], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          fontFamily: FONT_MONO,
          fontSize: SIZE,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: COLOR.text,
          whiteSpace: "pre",
          filter: out > 0 ? `blur(${out * 10}px)` : "none",
          transform: `scale(${1 + out * 0.04})`,
        }}
      >
        {/* Invisible full word reserves the final width so typing grows from the left. */}
        <span style={{ visibility: "hidden" }}>{WORD}</span>
        <Cursor size={SIZE} visible={false} />
        <div style={{ position: "absolute", left: 0, top: 0 }}>
          {WORD.slice(0, typed)}
          <Cursor size={SIZE} visible={visible} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
