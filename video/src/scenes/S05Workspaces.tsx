import React from "react";
import { AbsoluteFill } from "remotion";
import { Caption } from "../components/Caption";
import { Terminal } from "../components/Terminal";
import { compile, prompt } from "../components/session";
import type { Copy } from "../copy";
import { COLOR } from "../theme";

const W = COLOR.text;

// Every emoji line below is printed verbatim by modules/workspaces.sh.
// "Now using node ..." is nvm's own output when the hook runs.
export const SESSION_WORKSPACES = compile(
  [
    { kind: "cmd", prompt: prompt("~/Dev"), cmd: "ws api", wait: 12 },
    { kind: "out", lines: ["✨ Entered workspace: api"], color: W, gap: 6 },
    {
      kind: "out",
      color: COLOR.amber,
      lines: ["⚠️  Untrusted .bw-on-enter found. Review it and run 'ws-trust' to allow it."],
    },
    { kind: "pause", frames: 16 },
    { kind: "cmd", prompt: prompt("~/Dev/api"), cmd: "ws-trust", wait: 10 },
    {
      kind: "out",
      every: 5,
      lines: [
        [{ text: "----- .bw-on-enter -----", color: COLOR.muted }],
        [{ text: "nvm use 20", color: W }],
        [{ text: "------------------------", color: COLOR.muted }],
      ],
    },
    {
      kind: "ask",
      spans: [{ text: "Trust and run this hook in future visits? [y/N] " }],
      answer: "y",
      wait: 18,
      enter: 6,
    },
    { kind: "out", lines: ["✅ Hook trusted. It will run on your next 'ws' visit."], color: W },
    { kind: "pause", frames: 14 },
    { kind: "cmd", prompt: prompt("~/Dev/api"), cmd: "ws api", wait: 8 },
    { kind: "out", lines: ["✨ Entered workspace: api", "🪄 Running workspace hook..."], color: W, every: 8 },
    {
      kind: "out",
      lines: ["Now using node v20.18.0 (npm v10.8.2)"],
      small: true,
      color: COLOR.muted,
      gap: 8,
    },
  ],
  70,
);

export const Workspaces: React.FC<{ copy: Copy }> = ({ copy }) => (
  <AbsoluteFill>
    <Caption text={copy.workspaces.caption} at={2} settleAt={34} />
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 196 }}>
      <Terminal session={SESSION_WORKSPACES} width={1440} height={800} title="Dev — zsh" enterAt={46} />
    </AbsoluteFill>
  </AbsoluteFill>
);
