import React from "react";
import { AbsoluteFill } from "remotion";
import { Caption } from "../components/Caption";
import { Terminal } from "../components/Terminal";
import { compile, prompt } from "../components/session";
import type { Copy } from "../copy";
import { COLOR } from "../theme";

const API = prompt("~/Dev/api");
const W = COLOR.text;

// gup + nr. "Syncing branch..." and "-> Using 'pnpm'..." are the exact strings
// printed by modules/git.sh and modules/node.sh; the dimmed lines are what git,
// zsh's `select` and pnpm print around them.
export const SESSION_ONE_SPELL = compile(
  [
    { kind: "cmd", prompt: API, cmd: "gup", wait: 12 },
    { kind: "out", lines: ["Syncing branch 'main'..."], color: W, gap: 6 },
    {
      kind: "out",
      small: true,
      color: COLOR.muted,
      gap: 12,
      every: 5,
      lines: [
        "From github.com:acme/api",
        "   3f2a91c..8d04e7b  main       -> origin/main",
        "Successfully rebased and updated refs/heads/main.",
        "To github.com:acme/api.git",
        "   8d04e7b..c71e5a2  main -> main",
      ],
    },
    { kind: "pause", frames: 16 },
    { kind: "cmd", prompt: API, cmd: "nr", wait: 10 },
    { kind: "out", lines: ["Please select a script to run:"], color: W },
    { kind: "out", lines: ["1) build  2) dev    3) lint   4) test"] },
    { kind: "ask", spans: [{ text: "?# " }], answer: "2", wait: 16, enter: 6 },
    {
      kind: "out",
      lines: [[{ text: "-> Using 'pnpm' to run 'dev'...", color: COLOR.green }]],
      gap: 4,
    },
    {
      kind: "out",
      small: true,
      color: COLOR.muted,
      gap: 10,
      every: 5,
      lines: ["", "> api@1.0.0 dev /Users/you/Dev/api", "> vite"],
    },
  ],
  72,
);

export const OneSpell: React.FC<{ copy: Copy }> = ({ copy }) => (
  <AbsoluteFill>
    <Caption text={copy.oneSpell.caption} at={2} settleAt={34} />
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 196 }}>
      <Terminal session={SESSION_ONE_SPELL} width={1440} height={800} title="api — zsh" enterAt={46} />
    </AbsoluteFill>
  </AbsoluteFill>
);
