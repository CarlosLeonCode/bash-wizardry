import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, FONT_MONO, FONT_SANS } from "../theme";
import { clamp, progress } from "./anim";
import type { Line, Session } from "./session";

const OUTPUT = "#C9D0CA";
const TITLE_BAR = 52;
const PAD_X = 40;
const PAD_Y = 30;

type WindowProps = {
  width: number;
  height: number;
  title: string;
  enterAt?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

// macOS-style window: rounded, hairline border, traffic lights, soft shadow.
// Enters with a gentle rise + fade + blur.
export const TerminalWindow: React.FC<WindowProps> = ({
  width,
  height,
  title,
  enterAt = 0,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, enterAt, 30);
  const lights = ["#FF5F57", "#FEBC2E", "#28C840"];
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 18,
        background: COLOR.window,
        border: `1px solid ${COLOR.border}`,
        boxShadow:
          "0 50px 120px rgba(0,0,0,0.65), 0 18px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${(1 - p) * 48}px) scale(${0.985 + 0.015 * p})`,
        filter: p >= 1 ? "none" : `blur(${(1 - p) * 10}px)`,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div
        style={{
          height: TITLE_BAR,
          flexShrink: 0,
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          borderBottom: `1px solid rgba(255,255,255,0.05)`,
          background: "linear-gradient(rgba(255,255,255,0.035), rgba(255,255,255,0.015))",
        }}
      >
        <div style={{ display: "flex", gap: 9 }}>
          {lights.map((c) => (
            <div
              key={c}
              style={{ width: 13, height: 13, borderRadius: 7, background: c, opacity: 0.85 }}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: FONT_SANS,
            fontSize: 17,
            fontWeight: 500,
            color: COLOR.muted,
            letterSpacing: "0.01em",
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>{children}</div>
    </div>
  );
};

type ViewProps = {
  session: Session;
  fontSize?: number;
  lineHeight?: number;
  // Hide the cursor after this frame (e.g. when the shot is about to cut).
  cursorUntil?: number;
};

const lineFontSize = (line: Line, size: number) => (line.small ? Math.round(size * 0.8) : size);

// Renders a compiled session with line-by-line reveals, frame-driven typing,
// a blinking block cursor and smooth auto-scroll when output overflows.
export const TerminalView: React.FC<ViewProps & { viewportHeight: number }> = ({
  session,
  fontSize = 30,
  lineHeight = 1.55,
  viewportHeight,
  cursorUntil = Infinity,
}) => {
  const frame = useCurrentFrame();
  const visible = session.lines.filter((l) => frame >= l.at);

  // Smooth scroll: each line's height eases in as it appears.
  const usable = viewportHeight - PAD_Y * 2;
  const total = visible.reduce((acc, l) => {
    const h = lineFontSize(l, fontSize) * lineHeight;
    return acc + h * progress(frame, l.at, 7);
  }, 0);
  const offset = Math.max(0, total - usable);

  const last = visible[visible.length - 1];
  const cursorLine = last?.input ? last : undefined;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: `${PAD_Y}px ${PAD_X}px`,
        fontFamily: FONT_MONO,
        color: OUTPUT,
      }}
    >
      <div style={{ transform: `translateY(${-offset}px)` }}>
        {visible.map((line, i) => {
          const size = lineFontSize(line, fontSize);
          const op = interpolate(frame, [line.at, line.at + 5], [0, 1], clamp);
          const typedCount = line.typed ? line.typed.times.filter((t) => frame >= t).length : 0;
          const typedText = line.typed ? Array.from(line.typed.text).slice(0, typedCount).join("") : "";
          const lastKey = line.typed?.times[typedCount - 1] ?? -100;
          const typing =
            !!line.typed &&
            typedCount < line.typed.times.length &&
            frame >= (line.typed.times[0] ?? 0) - 8;
          const solid = typing || frame - lastKey < 10;
          const blinkOn = solid || Math.floor((frame - line.at) / 16) % 2 === 0;
          const showCursor = line === cursorLine && frame < cursorUntil && blinkOn;
          return (
            <div
              key={i}
              style={{
                fontSize: size,
                lineHeight: `${size * lineHeight}px`,
                height: size * lineHeight,
                whiteSpace: "pre",
                opacity: op,
                transform: `translateY(${(1 - op) * 6}px)`,
              }}
            >
              {line.spans.map((s, j) => (
                <span key={j} style={{ color: s.color, fontWeight: s.weight }}>
                  {s.text}
                </span>
              ))}
              {typedText && (
                <span style={{ color: line.typed?.color ?? COLOR.text, fontWeight: 500 }}>
                  {typedText}
                </span>
              )}
              {line === cursorLine && <Cursor size={size} visible={showCursor} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Cursor: React.FC<{ size: number; visible: boolean; color?: string }> = ({
  size,
  visible,
  color = COLOR.green,
}) => (
  <span
    style={{
      display: "inline-block",
      width: size * 0.58,
      height: size * 1.12,
      marginLeft: 2,
      verticalAlign: "middle",
      transform: `translateY(-${size * 0.06}px)`,
      background: color,
      opacity: visible ? 1 : 0,
      boxShadow: visible ? `0 0 ${size * 0.5}px rgba(57,255,106,0.35)` : "none",
    }}
  />
);

type TerminalProps = Omit<WindowProps, "children"> & ViewProps;

export const Terminal: React.FC<TerminalProps> = ({
  session,
  fontSize,
  lineHeight,
  cursorUntil,
  ...win
}) => (
  <TerminalWindow {...win}>
    <TerminalView
      session={session}
      fontSize={fontSize}
      lineHeight={lineHeight}
      cursorUntil={cursorUntil}
      viewportHeight={win.height - TITLE_BAR}
    />
  </TerminalWindow>
);
