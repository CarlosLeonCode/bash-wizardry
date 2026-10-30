// Social card (Open Graph and Twitter) for each locale's home page, rendered
// at build time by the route handlers app/(en)/og.png and app/(es)/es/og.png.
// The font ships in the repo (JetBrains Mono, SIL OFL 1.1: see
// src/assets/fonts/OFL.txt), so the build needs no network.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getDictionary, OG_SIZE, type Locale } from "@/lib/i18n";

const COLOR = {
  bg: "#020502",
  green: "#39ff6a",
  text: "#eafff0",
  muted: "#7fa487",
  line: "rgba(57, 255, 106, 0.32)",
};

const GLOW = "0 0 18px rgba(57, 255, 106, 0.55)";

const asset = (...path: string[]) => readFile(join(process.cwd(), ...path));

export async function renderOgImage(locale: Locale) {
  const { og } = getDictionary(locale).meta;
  const [font, icon] = await Promise.all([
    asset("src/assets/fonts/JetBrainsMono-Bold.ttf"),
    asset("public/icons/icon-192.png"),
  ]);
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 48,
          backgroundColor: COLOR.bg,
          backgroundImage:
            "radial-gradient(circle at 85% 0%, rgba(57, 255, 106, 0.18), transparent 55%)",
          fontFamily: "JetBrains Mono",
          color: COLOR.text,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            border: `2px solid ${COLOR.line}`,
            borderRadius: 18,
            backgroundColor: "rgba(2, 5, 2, 0.6)",
          }}
        >
          {/* Window title bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 54,
              padding: "0 24px",
              borderBottom: `2px solid ${COLOR.line}`,
              fontSize: 20,
              color: COLOR.muted,
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              {["#ff5f57", "#febc2e", COLOR.green].map((dot) => (
                <div
                  key={dot}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: dot,
                    opacity: 0.8,
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", marginLeft: 24 }}>
              ~/bash-wizardry — zsh
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "40px 48px 36px",
            }}
          >
            {/* Wordmark */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
              <img src={iconSrc} width={60} height={60} alt="" />
              <div
                style={{
                  display: "flex",
                  fontSize: 40,
                  color: COLOR.green,
                  textShadow: GLOW,
                }}
              >
                bash-wizardry
              </div>
            </div>

            {/* Headline */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 36,
                fontSize: 66,
                lineHeight: 1.08,
                letterSpacing: -1,
              }}
            >
              <div style={{ display: "flex" }}>{og.headline[0]}</div>
              <div style={{ display: "flex", color: COLOR.green, textShadow: GLOW }}>
                {og.headline[1]}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 22,
                fontSize: 27,
                color: COLOR.muted,
              }}
            >
              {og.subline}
            </div>

            {/* Prompt and domain */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginTop: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "14px 22px",
                  border: `2px solid ${COLOR.line}`,
                  borderRadius: 10,
                  fontSize: 26,
                }}
              >
                <span style={{ color: COLOR.green, marginRight: 14 }}>❯</span>
                <span>bwiz help --json git</span>
                <div
                  style={{
                    width: 14,
                    height: 30,
                    marginLeft: 10,
                    backgroundColor: COLOR.green,
                  }}
                />
              </div>
              <div style={{ display: "flex", fontSize: 26, color: COLOR.muted }}>
                bashwizardry.com
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "JetBrains Mono", data: font, weight: 700, style: "normal" }],
    },
  );
}
