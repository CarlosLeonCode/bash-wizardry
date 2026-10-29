import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EASE_IN_OUT } from "../theme";
import { XFADE } from "../timeline";

type Props = {
  duration: number;
  fadeIn?: boolean;
  fadeOut?: boolean;
  // Slow push-in over the whole shot (1.0 -> 1 + drift).
  drift?: number;
  children: React.ReactNode;
};

// Wraps a scene: soft cross-fade in/out across the XFADE overlap and an
// optional, barely-there camera push-in.
export const SceneShell: React.FC<Props> = ({
  duration,
  fadeIn = true,
  fadeOut = true,
  drift = 0.03,
  children,
}) => {
  const frame = useCurrentFrame();
  const opIn = fadeIn
    ? interpolate(frame, [0, XFADE], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE_IN_OUT,
      })
    : 1;
  const opOut = fadeOut
    ? interpolate(frame, [duration, duration + XFADE], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE_IN_OUT,
      })
    : 1;
  const scale = interpolate(frame, [0, duration + XFADE], [1, 1 + drift], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: opIn * opOut, transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};
