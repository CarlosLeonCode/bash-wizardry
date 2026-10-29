import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import { Terminal } from "../components/Terminal";
import { clamp } from "../components/anim";
import { compile, prompt } from "../components/session";
import type { Copy } from "../copy";
import { COLOR } from "../theme";

// gclean, exactly as modules/git.sh prints it (nothing new to fetch, so git
// itself stays silent), stopping at the confirmation prompt.
export const SESSION_GCLEAN = compile(
  [
    { kind: "cmd", prompt: prompt("~/Dev/api"), cmd: "gclean", wait: 12 },
    { kind: "out", lines: ["Fetching latest state from origin..."], color: COLOR.text, gap: 6 },
    {
      kind: "out",
      gap: 18,
      every: 5,
      lines: [
        [{ text: "Branches merged into origin/main:", color: COLOR.text }],
        "  - feat/login-form",
        "  - fix/rate-limit",
      ],
    },
    {
      kind: "ask",
      gap: 10,
      spans: [
        { text: "Delete these 2 merged branches? ", color: COLOR.text },
        { text: "[y/N]", color: COLOR.amber, weight: 700 },
        { text: " " },
      ],
    },
  ],
  60,
);

const askAt = SESSION_GCLEAN.lines[SESSION_GCLEAN.lines.length - 1].at;

export const AsksFirst: React.FC<{ copy: Copy }> = ({ copy }) => {
  const frame = useCurrentFrame();
  // A slow amber breath around the window once the question is asked.
  const glow = interpolate(frame, [askAt, askAt + 30], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Caption text={copy.asksFirst.caption} at={2} settleAt={30} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 50 }}>
        <Terminal
          session={SESSION_GCLEAN}
          width={1240}
          height={520}
          title="api — zsh"
          enterAt={40}
          style={{
            boxShadow: `0 50px 120px rgba(0,0,0,0.65), 0 0 ${140 * glow}px rgba(255,176,0,${0.1 * glow})`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
