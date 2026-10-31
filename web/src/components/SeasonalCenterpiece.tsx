"use client";

import { useId, type ReactNode } from "react";
import type { Season } from "@/lib/season";
import { useSeason } from "@/lib/use-season";
import styles from "./SeasonalCenterpiece.module.css";

/**
 * Small seasonal line-art vignette beside the hero's author signature.
 * Absolutely positioned inside a slot that is exactly as tall as the
 * signature, so it never moves the layout; renders only in season, after
 * hydration. Static for reduced motion (the CSS animates nothing then).
 */
export default function SeasonalCenterpiece() {
  const season = useSeason();
  if (!season) return null;
  const scene = SCENES[season];

  return (
    <div className={styles.slot} aria-hidden="true">
      {/* Desktop: the full scene. Phones: a tighter crop of its main figures. */}
      <Art className={styles.wide} viewBox={scene.wide} season={season} />
      <Art className={styles.compact} viewBox={scene.compact} season={season} />
    </div>
  );
}

function Art({
  className,
  viewBox,
  season,
}: {
  className: string;
  viewBox: string;
  season: Season;
}) {
  const glow = useId();
  const Scene = SCENES[season].Scene;
  return (
    <svg
      className={`${styles.art} ${className}`}
      viewBox={viewBox}
      fill="none"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="xMinYMax meet"
      focusable="false"
    >
      <defs>
        <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <Scene glow={`url(#${glow})`} />
    </svg>
  );
}

// ---- scenes -----------------------------------------------------------------
// Line art on a 1-unit grid; viewBoxes crop each scene tightly.

type SceneProps = { glow: string };

const SCENES: Record<
  Season,
  { wide: string; compact: string; Scene: (props: SceneProps) => ReactNode }
> = {
  halloween: { wide: "34 10 206 88", compact: "38 32 96 66", Scene: Halloween },
  christmas: { wide: "18 4 158 94", compact: "18 4 94 94", Scene: Christmas },
  valentine: { wide: "28 8 174 86", compact: "58 12 132 82", Scene: Valentine },
};

/** Lit jack-o'-lantern, a little ghost and a castle on the horizon. */
function Halloween({ glow }: SceneProps) {
  return (
    <>
      <path className={styles.ground} d="M40 96 H236" />

      {/* castle: towers, crenellated walls, lit windows */}
      <g className={styles.castle}>
        <path d="M154 96 V58 h3 v-4 h3 v4 h3 v-4 h3 v4 h3 v-4 h3 V70 h2 v-3 h3 v3 h3 v-3 h3 v3 h3 V44 L195 22 L204 44 V70 h3 v-3 h3 v3 h3 v-3 h3 V52 L223 38 L230 52 V96" />
        <path d="M195 22 V14 l5 2 l-5 2" />
        <path d="M190 96 v-7 a5 5 0 0 1 10 0 v7" />
      </g>
      <g className={styles.windows} filter={glow}>
        <path d="M193 60 v-4 a2 2 0 0 1 4 0 v4 z" />
        <path d="M162.4 63 h1.4 v5 h-1.4 z" />
        <path d="M222.3 60 h1.4 v5 h-1.4 z" />
      </g>

      {/* jack-o'-lantern */}
      <g className={styles.pumpkin}>
        {/* three lobes; the middle one, drawn last, hides the others' inner edges */}
        <ellipse cx="53.5" cy="79" rx="11.5" ry="15.5" />
        <ellipse cx="74.5" cy="79" rx="11.5" ry="15.5" />
        <ellipse cx="64" cy="78.5" rx="12.5" ry="17" />
        <path d="M62.5 61.5 C62 57 63 54.5 66.5 52.5" />
        <path d="M64.5 57 c2.5 -2.5 6 -2.5 7.5 0" />
      </g>
      <g className={`${styles.face} ${styles.flicker}`} filter={glow}>
        <path d="M55 74 L58.5 67.5 L62 74 Z" />
        <path d="M66 74 L69.5 67.5 L73 74 Z" />
        <path d="M62.6 79 L64 76.6 L65.4 79 Z" />
        <path d="M53.5 81 Q64 91.5 74.5 81 L71 82.6 L69.6 85 L67 83.3 L64 85.8 L61 83.3 L58.4 85 L57 82.6 Z" />
      </g>

      {/* ghost: round head, stubby arms, flared wavy hem */}
      <ellipse className={styles.shadow} cx="112" cy="95.5" rx="11" ry="1.4" />
      <g className={`${styles.ghost} ${styles.float}`}>
        <path d="M128 77 C125 70 124 62 124 50 A12 12 0 0 0 100 50 C100 62 99 70 96 77 Q100 73 104 77 Q108 81 112 77 Q116 73 120 77 Q124 81 128 77 Z" />
        <path d="M100.4 58 C96 59 93.5 62 94.5 65 C96.5 65.2 99 63.5 100.2 62" />
        <path d="M123.6 58 C128 59 130.5 62 129.5 65 C127.5 65.2 125 63.5 123.8 62" />
        <ellipse className={styles.eye} cx="107.5" cy="47" rx="1.5" ry="2.3" />
        <ellipse className={styles.eye} cx="116.5" cy="47" rx="1.5" ry="2.3" />
        <ellipse cx="112" cy="54" rx="1.6" ry="2.1" />
      </g>
    </>
  );
}

/** Tiered tree with a star, presents with ribbon crosses. */
function Christmas({ glow }: SceneProps) {
  return (
    <>
      <path className={styles.ground} d="M20 96 H174" />

      <g className={styles.tree}>
        <path d="M80 22 L67 42 H73 L60 62 H67 L52 84 H108 L93 62 H100 L87 42 H93 Z" />
        <path d="M76 84 V96 H84 V84" />
        <path className={styles.garland} d="M70 50 Q80 55 91 47 M63 73 Q81 80 98 69" />
      </g>
      <g className={styles.ornaments} filter={glow}>
        <circle className={styles.red} cx="73.5" cy="48.5" r="1.8" />
        <circle className={styles.gold} cx="86.5" cy="45.5" r="1.8" />
        <circle className={styles.gold} cx="67" cy="71" r="1.8" />
        <circle className={styles.red} cx="81" cy="76" r="1.8" />
        <circle className={styles.red} cx="94" cy="66" r="1.8" />
      </g>
      <path
        className={`${styles.star} ${styles.twinkle}`}
        filter={glow}
        d={star(80, 15, 6.5, 2.7)}
      />

      <g className={styles.box}>
        <rect x="116" y="73" width="30" height="23" />
        <rect x="113.5" y="67" width="35" height="6" />
        <rect x="152" y="83" width="18" height="13" />
        <rect x="150.5" y="79" width="21" height="4" />
        <rect x="26" y="81" width="20" height="15" />
        <rect x="24.5" y="77" width="23" height="4" />
      </g>
      <g className={styles.ribbon} filter={glow}>
        <path d="M131 67 V96 M116 84 H146" />
        <path d="M131 67 C127 61 122 63 124.5 66.5 C126 68 129 67.6 131 67 C135 61 140 63 137.5 66.5 C136 68 133 67.6 131 67" />
        <path d="M161 79 V96 M152 89.5 H170" />
        <path d="M161 79 C158.5 75 155 76.5 156.8 78.6 M161 79 C163.5 75 167 76.5 165.2 78.6" />
        <path d="M36 77 V96 M26 88 H46" />
        <path d="M36 77 C33.5 73 30 74.5 31.8 76.6 M36 77 C38.5 73 42 74.5 40.2 76.6" />
      </g>
    </>
  );
}

/** A puffy heart pierced by an arrow, with a few small hearts. */
function Valentine({ glow }: SceneProps) {
  return (
    <>
      <g className={styles.arrow}>
        {/* Rotated along the shaft; the heart's filled body hides its middle. */}
        <g transform="translate(66 85) rotate(-29.7)">
          <path d="M0 0 H116" />
          <path className={styles.head} d="M114 -3.6 L122 0 L114 3.6 Z" />
          <path d="M1 0 L-5 -4.5 M1 0 L-5 4.5 M6 0 L0 -4.5 M6 0 L0 4.5 M11 0 L5 -4.5 M11 0 L5 4.5" />
        </g>
      </g>
      <g className={styles.pulse} filter={glow}>
        <path
          className={styles.bigHeart}
          transform="translate(91 27) scale(0.58)"
          d={HEART}
          vectorEffect="non-scaling-stroke"
        />
        {/* highlight on the left lobe: makes it read as puffy */}
        <path
          className={styles.shine}
          transform="translate(91 27) scale(0.58)"
          d="M14 33 C13 21 20 13 30 12"
          vectorEffect="non-scaling-stroke"
        />
      </g>
      <g className={styles.smallHearts} filter={glow}>
        <SmallHeart x={170} y={58} size={15} className={styles.blush} float={1} />
        {/* outside the phone crop */}
        <g className={styles.wideOnly}>
          <SmallHeart x={50} y={26} size={13} className={styles.rose} float={0} />
          <SmallHeart x={182} y={22} size={9} className={styles.rose} float={2} />
          <SmallHeart x={34} y={60} size={8} className={styles.blush} float={1} />
        </g>
      </g>
    </>
  );
}

function SmallHeart({
  x,
  y,
  size,
  className,
  float,
}: {
  x: number;
  y: number;
  size: number;
  className: string;
  float: 0 | 1 | 2;
}) {
  return (
    <g className={`${styles.float} ${styles[`delay${float}`]}`}>
      <path
        className={className}
        transform={`translate(${x} ${y}) scale(${size / 100})`}
        d={HEART}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}

/** Heart in a 100 x 90 box. */
const HEART =
  "M50 86 C21 65 2 48 2 28 C2 12 14 1 29 1 C39 1 46 7 50 16 C54 7 61 1 71 1 C86 1 98 12 98 28 C98 48 79 65 50 86 Z";

/** Five-pointed star path centred on (cx, cy). */
function star(cx: number, cy: number, outer: number, inner: number) {
  return (
    Array.from({ length: 10 }, (_, i) => {
      const r = i % 2 ? inner : outer;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      return `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
    }).join(" ") + " Z"
  );
}
