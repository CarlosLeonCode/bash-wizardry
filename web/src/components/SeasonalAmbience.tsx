"use client";

import { useEffect, useRef } from "react";
import type { Season } from "@/lib/season";
import { useMediaQuery, useSeason } from "@/lib/use-season";
import styles from "./SeasonalAmbience.module.css";

/**
 * Seasonal background: one fixed, transparent 2D canvas between the page
 * background and the content (z-index -1, like the CRT glow), with a few
 * slow sprites. Nothing renders outside a season, before hydration or for
 * reduced motion. Preview any season with ?season=halloween|christmas|
 * valentine, or hide it with ?season=none (src/lib/season.ts).
 */
export default function SeasonalAmbience() {
  const season = useSeason();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  if (!season || reducedMotion) return null;
  return <AmbienceCanvas key={season} season={season} />;
}

function AmbienceCanvas({ season }: { season: Season }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return;
    return startAmbience(canvas.current, SCENES[season]);
  }, [season]);

  return <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />;
}

// ---- scene description ------------------------------------------------------

type Range = readonly [number, number];

/** One kind of sprite: a texture drawn once, then stamped every frame. */
interface Layer {
  /** Draws the texture into a size x (size * aspect) box, in device pixels. */
  paint: (ctx: CanvasRenderingContext2D, size: number) => void;
  /** Texture height / width. */
  aspect?: number;
  /** Sprites on desktop; small screens get half (rounded up). */
  count: number;
  /** Drawn width in CSS px for the nearest sprites. */
  size: Range;
  alpha: Range;
  /** Velocity in CSS px per second for the nearest sprites. */
  vx: Range;
  vy: Range;
  /** Sideways (or, for "bob", vertical) sine drift: amplitude px, speed. */
  sway?: { amp: Range; speed: Range; axis?: "x" | "y" };
  /** Rotation speed in rad/s, or a gentle rocking amplitude in rad. */
  spin?: Range;
  rock?: number;
  flicker?: boolean;
  /** Wing beat as a vertical squash, beats per second. */
  flap?: Range;
  /** "lighter" for glows; dark silhouettes need "source-over". */
  blend: GlobalCompositeOperation;
}

const AMBER = "255, 176, 0";
const ORANGE = "255, 122, 26";
const SNOW = "233, 255, 240";
const CYAN = "77, 215, 255";
const ROSE = "255, 107, 154";
const BLUSH = "255, 179, 200";

const SCENES: Record<Season, Layer[]> = {
  // Embers rise and flicker; a few bats cross slowly.
  halloween: [
    {
      paint: ember,
      count: 34,
      size: [12, 28],
      alpha: [0.6, 1],
      vx: [-6, 6],
      vy: [-42, -16],
      sway: { amp: [6, 18], speed: [0.5, 1.3] },
      flicker: true,
      blend: "lighter",
    },
    {
      paint: bat,
      aspect: 0.5,
      count: 4,
      size: [44, 72],
      alpha: [0.75, 1],
      vx: [-38, 38],
      vy: [-5, 5],
      sway: { amp: [6, 14], speed: [0.8, 1.4], axis: "y" },
      flap: [1.4, 2.2],
      // Additive blending would erase a dark shape on a near-black page.
      blend: "source-over",
    },
  ],
  // Bokeh snow of mixed sizes plus a few fine, glowing line snowflakes.
  christmas: [
    bokeh(SNOW, { count: 18, size: [6, 34], alpha: [0.12, 0.32], vy: [10, 26] }),
    bokeh(CYAN, { count: 12, size: [8, 30], alpha: [0.12, 0.28], vy: [8, 22] }),
    {
      paint: snowflake,
      count: 8,
      size: [20, 38],
      alpha: [0.55, 0.9],
      vx: [-4, 4],
      vy: [12, 24],
      sway: { amp: [8, 20], speed: [0.3, 0.7] },
      spin: [-0.35, 0.35],
      blend: "lighter",
    },
  ],
  // Soft rose bokeh drifting up, a few outline hearts rocking as they rise.
  valentine: [
    bokeh(ROSE, { count: 18, size: [8, 34], alpha: [0.1, 0.26], vy: [-16, -6] }),
    bokeh(BLUSH, { count: 12, size: [6, 26], alpha: [0.08, 0.2], vy: [-14, -5] }),
    {
      paint: heart,
      aspect: 0.9,
      count: 8,
      size: [20, 38],
      alpha: [0.5, 0.85],
      vx: [-4, 4],
      vy: [-20, -10],
      sway: { amp: [8, 18], speed: [0.3, 0.6] },
      rock: 0.25,
      blend: "lighter",
    },
  ],
};

function bokeh(
  rgb: string,
  { count, size, alpha, vy }: Pick<Layer, "count" | "size" | "alpha" | "vy">,
): Layer {
  return {
    paint: (ctx, s) => {
      const r = s / 2;
      const g = ctx.createRadialGradient(r, r, 0, r, r, r);
      g.addColorStop(0, `rgba(${rgb}, 1)`);
      g.addColorStop(0.55, `rgba(${rgb}, 0.8)`);
      g.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
    },
    count,
    size,
    alpha,
    vx: [-5, 5],
    vy,
    sway: { amp: [10, 22], speed: [0.2, 0.5] },
    blend: "lighter",
  };
}

// ---- textures ---------------------------------------------------------------

/** Hot core, amber halo, orange falloff. Most of the box is glow. */
function ember(ctx: CanvasRenderingContext2D, s: number) {
  const r = s / 2;
  const g = ctx.createRadialGradient(r, r, 0, r, r, r);
  g.addColorStop(0, "rgba(255, 244, 214, 1)");
  g.addColorStop(0.16, `rgba(${AMBER}, 0.95)`);
  g.addColorStop(0.42, `rgba(${ORANGE}, 0.4)`);
  g.addColorStop(1, `rgba(${ORANGE}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
}

/** Bat silhouette in a 100 x 50 box: near-black fill, thin green rim. */
function bat(ctx: CanvasRenderingContext2D, s: number) {
  // Right half, from the top of the head round to the bottom of the body.
  const half: [number, number][] = [
    [50, 17], [52.5, 11], [54.5, 17.5], [58, 20],
    [66, 12], [80, 8], [97, 14], // leading edge to the wing tip
    [90, 18], [87, 27], [82, 22], [76, 30], [70, 25], [64, 33], [59, 28],
    [55, 33], [52.5, 38], [50, 40],
  ];
  const points = [...half, ...half.slice(1, -1).reverse().map(([x, y]) => [100 - x, y])];
  const pad = s * 0.03; // room for the rim stroke
  const k = (s - 2 * pad) / 100;
  ctx.translate(pad, pad);
  ctx.beginPath();
  points.forEach(([x, y], i) =>
    i ? ctx.lineTo(x * k, y * k) : ctx.moveTo(x * k, y * k),
  );
  ctx.closePath();
  ctx.fillStyle = "#030a05";
  ctx.fill();
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1, s / 48);
  ctx.strokeStyle = "rgba(57, 255, 106, 0.75)";
  ctx.shadowColor = `rgba(${AMBER}, 0.35)`;
  ctx.shadowBlur = s / 24;
  ctx.stroke();
}

/** Six fine arms with two side branches each, softly glowing. */
function snowflake(ctx: CanvasRenderingContext2D, s: number) {
  const r = s / 2;
  const arm = r * 0.72;
  ctx.translate(r, r);
  ctx.strokeStyle = `rgba(${SNOW}, 0.95)`;
  ctx.lineWidth = Math.max(1, s / 26);
  ctx.lineCap = "round";
  ctx.shadowColor = `rgba(${CYAN}, 0.9)`;
  ctx.shadowBlur = s / 10;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    ctx.rotate(Math.PI / 3);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -arm);
    for (const [at, len] of [[0.45, 0.22], [0.72, 0.16]]) {
      ctx.moveTo(0, -arm * at);
      ctx.lineTo(-arm * len, -arm * (at + len));
      ctx.moveTo(0, -arm * at);
      ctx.lineTo(arm * len, -arm * (at + len));
    }
  }
  ctx.stroke();
}

/** Outline heart in a 100 x 90 box, with a faint glow. */
function heart(ctx: CanvasRenderingContext2D, s: number) {
  const pad = s * 0.12;
  const k = (s - 2 * pad) / 100;
  ctx.translate(pad, pad * 0.9);
  ctx.scale(k, k);
  ctx.beginPath();
  ctx.moveTo(50, 84);
  ctx.bezierCurveTo(22, 64, 4, 47, 4, 28);
  ctx.bezierCurveTo(4, 13, 15, 3, 29, 3);
  ctx.bezierCurveTo(39, 3, 46, 9, 50, 17);
  ctx.bezierCurveTo(54, 9, 61, 3, 71, 3);
  ctx.bezierCurveTo(85, 3, 96, 13, 96, 28);
  ctx.bezierCurveTo(96, 47, 78, 64, 50, 84);
  ctx.closePath();
  ctx.strokeStyle = `rgba(${ROSE}, 0.95)`;
  ctx.lineWidth = Math.max(1, s / 24) / k;
  ctx.lineJoin = "round";
  ctx.shadowColor = `rgba(${ROSE}, 0.8)`;
  ctx.shadowBlur = (s / 12) / k;
  ctx.stroke();
}

function texture(layer: Layer, width: number) {
  const tex = document.createElement("canvas");
  tex.width = Math.ceil(width);
  tex.height = Math.ceil(width * (layer.aspect ?? 1));
  const ctx = tex.getContext("2d");
  if (ctx) layer.paint(ctx, tex.width);
  return tex;
}

// ---- engine -----------------------------------------------------------------

const SMALL_SCREEN = "(max-width: 819px), (pointer: coarse)";

interface Sprite {
  layer: number;
  x: number;
  y: number;
  /** Depth: 0 is far (small, dim, slow), 1 is near. */
  z: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  sway: number;
  swaySpeed: number;
  spin: number;
  flap: number;
}

const rand = ([min, max]: Range) => min + Math.random() * (max - min);
const smoothstep = (edge: number, v: number) => {
  const t = Math.min(Math.max(v / edge, 0), 1);
  return t * t * (3 - 2 * t);
};

/** Runs the scene on `canvas`; returns the cleanup. */
function startAmbience(canvas: HTMLCanvasElement, layers: Layer[]) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const small = window.matchMedia(SMALL_SCREEN);

  let dpr = 1;
  let width = 0;
  let height = 0;
  let textures: HTMLCanvasElement[] = [];
  let sprites: Sprite[] = [];
  let frame = 0;
  let last = 0;
  let time = 0;

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === width && h === height) return;
    width = w;
    height = h;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }

  // Small or touch screens: 1x pixels, half the sprites, 30 fps.
  function build() {
    dpr = small.matches ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    width = 0;
    resize();
    textures = layers.map((layer) => texture(layer, layer.size[1] * dpr));
    sprites = layers
      .flatMap((layer, index) =>
        Array.from(
          { length: small.matches ? Math.ceil(layer.count / 2) : layer.count },
          () => spawn(layer, index),
        ),
      )
      // Far first; dark silhouettes last so the glows don't wash them out.
      .sort(
        (a, b) =>
          Number(layers[a.layer].blend === "source-over") -
            Number(layers[b.layer].blend === "source-over") || a.z - b.z,
      );
  }

  function spawn(layer: Layer, index: number): Sprite {
    return {
      layer: index,
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random(),
      vx: rand(layer.vx),
      vy: rand(layer.vy),
      size: rand(layer.size),
      alpha: rand(layer.alpha),
      phase: Math.random() * Math.PI * 2,
      sway: layer.sway ? rand(layer.sway.amp) : 0,
      swaySpeed: layer.sway ? rand(layer.sway.speed) : 0,
      spin: layer.spin ? rand(layer.spin) : 0,
      flap: layer.flap ? rand(layer.flap) * Math.PI * 2 : 0,
    };
  }

  function draw(dt: number) {
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Fade band at every edge, so sprites never pop in or out.
    const fadeY = Math.min(140, height * 0.15);
    const fadeX = Math.min(100, width * 0.08);

    for (const s of sprites) {
      const layer = layers[s.layer];
      const tex = textures[s.layer];
      const scale = 0.5 + 0.5 * s.z;
      const speed = 0.4 + 0.6 * s.z;
      const w = s.size * scale;
      const h = w * (layer.aspect ?? 1);
      const margin = w + s.sway;

      s.x += s.vx * speed * dt;
      s.y += s.vy * speed * dt;
      if (s.y < -margin) s.y = height + margin;
      else if (s.y > height + margin) s.y = -margin;
      if (s.x < -margin) s.x = width + margin;
      else if (s.x > width + margin) s.x = -margin;

      const wave = Math.sin(time * s.swaySpeed + s.phase) * s.sway * scale;
      const x = layer.sway?.axis === "y" ? s.x : s.x + wave;
      const y = layer.sway?.axis === "y" ? s.y + wave : s.y;

      let alpha =
        s.alpha *
        (0.45 + 0.55 * s.z) *
        smoothstep(fadeY, y) *
        smoothstep(fadeY, height - y) *
        smoothstep(fadeX, x) *
        smoothstep(fadeX, width - x);
      if (layer.flicker) {
        alpha *=
          0.55 +
          0.45 *
            (0.5 + 0.5 * Math.sin(time * 7.3 + s.phase)) *
            (0.6 + 0.4 * Math.sin(time * 2.1 + s.phase * 1.7));
      }
      if (alpha < 0.004) continue;

      const squash = layer.flap
        ? 0.3 + 0.7 * (0.5 + 0.5 * Math.cos(time * s.flap + s.phase))
        : 1;
      const angle = layer.rock
        ? Math.sin(time * 0.8 + s.phase) * layer.rock
        : s.spin * time + s.phase;
      const cos = Math.cos(angle) * dpr;
      const sin = Math.sin(angle) * dpr;

      ctx.globalCompositeOperation = layer.blend;
      ctx.globalAlpha = Math.min(alpha, 1);
      if (layer.spin || layer.rock) {
        ctx.setTransform(cos, sin, -sin, cos, x * dpr, y * dpr);
      } else {
        ctx.setTransform(dpr, 0, 0, dpr, x * dpr, y * dpr);
      }
      ctx.drawImage(tex, -w / 2, (-h * squash) / 2, w, h * squash);
    }
  }

  function tick(now: number) {
    frame = requestAnimationFrame(tick);
    const elapsed = now - last;
    // 30 fps cap on small screens (2 ms of slack for timer jitter).
    if (small.matches && elapsed < 1000 / 30 - 2) return;
    last = now;
    // Clamp long gaps (a dropped frame, a resumed tab) to one small step.
    const dt = Math.min(elapsed / 1000, 0.05);
    time += dt;
    draw(dt);
  }

  function start() {
    if (frame || document.hidden) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  const onVisibility = () => (document.hidden ? stop() : start());

  build();
  start();
  window.addEventListener("resize", resize);
  small.addEventListener("change", build);
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    stop();
    window.removeEventListener("resize", resize);
    small.removeEventListener("change", build);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
