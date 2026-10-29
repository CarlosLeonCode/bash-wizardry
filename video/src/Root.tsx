import React from "react";
import { AbsoluteFill, Composition, Sequence } from "remotion";
import { Background } from "./components/Background";
import { SceneShell } from "./components/SceneShell";
import { COPY, type Locale } from "./copy";
import { ColdOpen } from "./scenes/S01ColdOpen";
import { Title } from "./scenes/S02Title";
import { Problem } from "./scenes/S03Problem";
import { OneSpell } from "./scenes/S04OneSpell";
import { Workspaces } from "./scenes/S05Workspaces";
import { AsksFirst } from "./scenes/S06AsksFirst";
import { Agents } from "./scenes/S07Agents";
import { MakeItYours } from "./scenes/S08MakeItYours";
import { Numbers } from "./scenes/S09Numbers";
import { EndCard } from "./scenes/S10EndCard";
import { FPS, HEIGHT, WIDTH } from "./theme";
import { SCENES, TOTAL_FRAMES, XFADE, type SceneId } from "./timeline";

type Props = { locale: Locale };

const renderScene = (id: SceneId, locale: Locale, duration: number) => {
  const copy = COPY[locale];
  switch (id) {
    case "cold-open":
      return <ColdOpen duration={duration} />;
    case "title":
      return <Title copy={copy} />;
    case "problem":
      return <Problem copy={copy} duration={duration} />;
    case "one-spell":
      return <OneSpell copy={copy} />;
    case "workspaces":
      return <Workspaces copy={copy} />;
    case "asks-first":
      return <AsksFirst copy={copy} />;
    case "agents":
      return <Agents copy={copy} />;
    case "make-it-yours":
      return <MakeItYours copy={copy} />;
    case "numbers":
      return <Numbers copy={copy} />;
    case "end-card":
      return <EndCard copy={copy} duration={duration} />;
  }
};

export const BashWizardry: React.FC<Props> = ({ locale }) => (
  // Ligatures off everywhere: the scripts print "->", not an arrow glyph.
  <AbsoluteFill style={{ fontVariantLigatures: "none", fontFeatureSettings: "\"liga\" 0, \"calt\" 0" }}>
    <Background />
    {SCENES.map((s, i) => {
      const isFirst = i === 0;
      const isLast = i === SCENES.length - 1;
      return (
        <Sequence
          key={s.id}
          name={s.id}
          from={s.from}
          durationInFrames={s.duration + (isLast ? 0 : XFADE)}
        >
          <SceneShell
            duration={s.duration}
            fadeIn={!isFirst}
            fadeOut={!isLast}
            drift={s.id === "cold-open" || s.id === "end-card" ? 0.015 : 0.03}
          >
            {renderScene(s.id, locale, s.duration)}
          </SceneShell>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <>
    {(["en", "es"] as const).map((locale) => (
      <Composition
        key={locale}
        id={`BashWizardry-${locale}`}
        component={BashWizardry}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ locale }}
      />
    ))}
  </>
);
