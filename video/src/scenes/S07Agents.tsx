import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Terminal } from "../components/Terminal";
import { clamp, softReveal } from "../components/anim";
import { compile, prompt, type Span } from "../components/session";
import type { Copy } from "../copy";
import stats from "../stats.generated.json";
import { COLOR, EASE_IN_OUT, FONT_SANS } from "../theme";

const SETTLE = 78;
const WIN_W = 830;
const WIN_H = 560;
const FONT = 27;

// Your interactive shell: spells are loaded.
export const SESSION_YOU = compile(
  [
    { kind: "cmd", prompt: prompt("~/Dev/api"), cmd: "gs", wait: 12 },
    {
      kind: "out",
      lines: [
        [{ text: "## main...origin/main", color: COLOR.text }],
        " M src/server.ts",
      ],
    },
    { kind: "pause", frames: 18 },
    { kind: "cmd", prompt: prompt("~/Dev/api"), cmd: "gup", wait: 10 },
    { kind: "out", lines: ["Syncing branch 'main'..."], color: COLOR.text },
    {
      kind: "out",
      lines: ["Already up to date.", "Everything up-to-date"],
      small: true,
      color: COLOR.muted,
      gap: 10,
      every: 6,
    },
    { kind: "pause", frames: 6 },
    { kind: "cmd", prompt: prompt("~/Dev/api"), cmd: "", wait: 0 },
  ],
  SETTLE + 36,
);

// The agent's shell: CLAUDECODE=1 puts init.sh in agent mode, so nothing is
// defined. bwiz (a script on PATH) still describes every spell as JSON.
const AGENT: Span[] = [{ text: "$ ", color: COLOR.green }];
export const SESSION_AGENT = compile(
  [
    { kind: "cmd", prompt: AGENT, cmd: "echo $CLAUDECODE", wait: 4, enter: 6, cps: 34 },
    { kind: "out", lines: ["1"] },
    { kind: "cmd", prompt: AGENT, cmd: "alias | wc -l", wait: 4, enter: 6, cps: 34 },
    { kind: "out", lines: ["0"] },
    { kind: "cmd", prompt: AGENT, cmd: "type gup", wait: 4, enter: 6, cps: 34 },
    { kind: "out", lines: ["bash: type: gup: not found"] },
    { kind: "cmd", prompt: AGENT, cmd: "bwiz help --json git | jq length", wait: 4, enter: 6, cps: 34 },
    { kind: "out", lines: [[{ text: String(stats.perModule.git), color: COLOR.text }]] },
    { kind: "cmd", prompt: AGENT, cmd: "", wait: 0 },
  ],
  SETTLE + 44,
);

const AGENTS = ["Claude Code", "Codex", "Cursor", "Gemini CLI"];

export const Agents: React.FC<{ copy: Copy }> = ({ copy }) => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [SETTLE, SETTLE + 30], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const headY = interpolate(move, [0, 1], [540, 132]);
  const headScale = interpolate(move, [0, 1], [1, 0.48]);
  const namesAt = SESSION_AGENT.end - 4;

  const label = (text: string, at: number) => (
    <div
      style={{
        fontFamily: FONT_SANS,
        fontSize: 26,
        fontWeight: 500,
        color: COLOR.muted,
        letterSpacing: "0.01em",
        marginBottom: 18,
        ...softReveal(frame, at, 24, 10, 8),
      }}
    >
      {text}
    </div>
  );

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: headY,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `translateY(-50%) scale(${headScale})`,
            fontFamily: FONT_SANS,
            fontWeight: 700,
            fontSize: 112,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ color: COLOR.text, ...softReveal(frame, 4, 30, 24, 16) }}>{copy.agents.line1}</div>
          <div style={{ color: COLOR.muted, ...softReveal(frame, 28, 30, 24, 16) }}>{copy.agents.line2}</div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 236,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 60,
        }}
      >
        <div>
          {label(copy.agents.you, SETTLE + 10)}
          <Terminal
            session={SESSION_YOU}
            width={WIN_W}
            height={WIN_H}
            fontSize={FONT}
            title="api — zsh"
            enterAt={SETTLE + 14}
          />
        </div>
        <div>
          {label(copy.agents.agent, SETTLE + 22)}
          <Terminal
            session={SESSION_AGENT}
            width={WIN_W}
            height={WIN_H}
            fontSize={FONT}
            title="api — bash · CLAUDECODE=1"
            enterAt={SETTLE + 26}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 930,
          display: "flex",
          justifyContent: "center",
          gap: 28,
          fontFamily: FONT_SANS,
          fontSize: 30,
          fontWeight: 500,
          color: COLOR.muted,
          letterSpacing: "-0.01em",
        }}
      >
        {AGENTS.map((name, i) => (
          <React.Fragment key={name}>
            {i > 0 && (
              <span style={{ ...softReveal(frame, namesAt + i * 10 - 4, 20, 0, 0), color: COLOR.faint }}>·</span>
            )}
            <span style={softReveal(frame, namesAt + i * 10, 24, 12, 10)}>{name}</span>
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};
