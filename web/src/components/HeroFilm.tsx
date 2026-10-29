"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { MOTION_OK } from "@/lib/gsap";
import type { HeroFilmCopy } from "@/lib/i18n/types";
import { HERO_FILM_DURATION, type HeroFilmSource } from "@/lib/site";
import styles from "./HeroFilm.module.css";

/** Share of the pane that must be on screen before the film plays. */
const PLAY_THRESHOLD = 0.4;
/** How far ahead of the viewport the film starts buffering. */
const PRELOAD_MARGIN = "200px";
const DEFAULT_CELLS = 20;
const MIN_CELLS = 8;
const MAX_CELLS = 100;

/**
 * "auto": play while visible unless the visitor prefers reduced motion.
 * "play" / "pause": the visitor chose; autoplay no longer decides.
 */
type Intent = "auto" | "play" | "pause";

function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(MOTION_OK);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

const clock = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/**
 * The product film inside a terminal pane, with mono "player" controls.
 *
 * Server-rendered with the poster, so the 16:9 box never shifts. The video
 * only buffers once the pane nears the viewport (after the page has loaded),
 * autoplays muted while at least 40% visible and the tab is in front, and
 * never autoplays for reduced motion: the play button is always there.
 */
export default function HeroFilm({
  film,
  t,
}: {
  film: HeroFilmSource;
  t: HeroFilmCopy;
}) {
  const pane = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const seekSlot = useRef<HTMLDivElement>(null);
  const charProbe = useRef<HTMLSpanElement>(null);
  const summaryId = useId();

  const motionOk = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(MOTION_OK).matches,
    () => false,
  );
  const tabVisible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => false,
  );

  const [near, setNear] = useState(false);
  // Any part on screen / at least PLAY_THRESHOLD on screen.
  const [onScreen, setOnScreen] = useState(false);
  const [inView, setInView] = useState(false);
  const [intent, setIntent] = useState<Intent>("auto");
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(HERO_FILM_DURATION);
  const [cells, setCells] = useState(DEFAULT_CELLS);

  // Start buffering once the pane approaches, but never before the page's
  // own load event, so the film doesn't compete with first paint.
  useEffect(() => {
    const el = pane.current;
    if (!el) return;
    let observer: IntersectionObserver | null = null;
    const watch = () => {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setNear(true);
            observer?.disconnect();
          }
        },
        { rootMargin: PRELOAD_MARGIN },
      );
      observer.observe(el);
    };
    if (document.readyState === "complete") watch();
    else window.addEventListener("load", watch, { once: true });
    return () => {
      window.removeEventListener("load", watch);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = pane.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting);
        setInView(entry.intersectionRatio >= PLAY_THRESHOLD);
      },
      { threshold: [0, PLAY_THRESHOLD] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Autoplay needs 40% of the pane; a film the visitor started keeps playing
  // while any of it is on screen. Both stop when the tab is hidden.
  const shouldPlay =
    tabVisible &&
    (intent === "play"
      ? onScreen
      : intent === "auto" && motionOk && inView);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (shouldPlay) {
      el.preload = "auto";
      // Muted autoplay can still be refused (e.g. low-power mode): stay paused.
      el.play().catch(() => setPlaying(false));
    } else if (!el.paused) {
      el.pause();
    }
  }, [shouldPlay]);

  useEffect(() => {
    if (near && video.current) video.current.preload = "auto";
  }, [near]);

  // Fit the text progress bar to its slot, one cell per character.
  useEffect(() => {
    const slot = seekSlot.current;
    const probe = charProbe.current;
    if (!slot || !probe) return;
    const observer = new ResizeObserver(([entry]) => {
      const ch = probe.getBoundingClientRect().width / 10;
      if (!ch) return;
      const fit = Math.floor(entry.contentRect.width / ch) - 2;
      setCells(Math.min(MAX_CELLS, Math.max(MIN_CELLS, fit)));
    });
    observer.observe(slot);
    return () => observer.disconnect();
  }, []);

  const play = () => {
    setIntent("play");
    const el = video.current;
    if (!el) return;
    el.preload = "auto";
    el.play().catch(() => setPlaying(false));
  };

  const pause = () => {
    setIntent("pause");
    video.current?.pause();
  };

  const toggle = () => (playing ? pause() : play());

  const replay = () => {
    const el = video.current;
    if (el) el.currentTime = 0;
    setCurrent(0);
    play();
  };

  const seek = (seconds: number) => {
    const el = video.current;
    if (el) {
      el.preload = "auto";
      el.currentTime = seconds;
    }
    setCurrent(seconds);
  };

  const filled = Math.round((Math.min(current, duration) / duration) * cells);
  const action = playing ? t.pause : t.play;
  const timeText = t.timeOf
    .replace("{current}", clock(current))
    .replace("{total}", clock(duration));

  return (
    <figure
      ref={pane}
      className={styles.pane}
      data-hero-fade
      style={{ "--poster": `url(${film.poster})` } as CSSProperties}
    >
      <figcaption className={styles.title}>
        <span>
          <span className={styles.rule} aria-hidden="true">
            ──{" "}
          </span>
          {t.pane}
          <span className={styles.rule} aria-hidden="true">
            {" "}──
          </span>
        </span>
        <span className={styles.file} aria-hidden="true">
          mpv {film.file}
        </span>
      </figcaption>

      <div className={styles.screen}>
        {/* Clicking the picture is a pointer shortcut; the buttons below
            are the accessible controls. */}
        <video
          ref={video}
          className={styles.video}
          muted
          loop
          playsInline
          preload="none"
          poster={film.poster}
          aria-label={t.label}
          aria-describedby={summaryId}
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => {
            const d = e.currentTarget.duration;
            if (Number.isFinite(d) && d > 0) setDuration(d);
          }}
        >
          <source src={film.src} type="video/mp4" />
        </video>
        <div className={styles.crt} aria-hidden="true" />
      </div>
      <p id={summaryId} className="sr-only">
        {t.summary}
      </p>

      <div className={styles.controls} role="group" aria-label={t.controls}>
        <button
          type="button"
          className={styles.key}
          onClick={toggle}
          aria-label={action.label}
        >
          <span className={styles.swap} aria-hidden="true">
            <span className={playing ? undefined : styles.ghost}>
              [ ❚❚ {t.pause.text} ]
            </span>
            <span className={playing ? styles.ghost : undefined}>
              [ ▶&#xFE0E; {t.play.text} ]
            </span>
          </span>
        </button>
        <button
          type="button"
          className={styles.key}
          onClick={replay}
          aria-label={t.replay.label}
        >
          <span aria-hidden="true">[ ↺ {t.replay.text} ]</span>
        </button>

        <div ref={seekSlot} className={styles.seek}>
          <span className={styles.bar} aria-hidden="true">
            [<span className={styles.done}>{"#".repeat(filled)}</span>
            {"-".repeat(cells - filled)}]
          </span>
          <input
            type="range"
            className={styles.range}
            min={0}
            max={duration}
            step={1}
            value={Math.min(current, duration)}
            onChange={(e) => seek(Number(e.currentTarget.value))}
            aria-label={t.seek}
            aria-valuetext={timeText}
          />
          <span ref={charProbe} className={styles.probe} aria-hidden="true">
            ##########
          </span>
        </div>

        <span className={styles.time} aria-hidden="true">
          {clock(current)} / {clock(duration)}
        </span>
      </div>
    </figure>
  );
}
