"use client";

import { useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import styles from "./CopyButton.module.css";

type Status = "idle" | "copied" | "error";

export default function CopyButton({
  text,
  label,
}: {
  text: string;
  label: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const root = useRef<HTMLSpanElement>(null);
  const resetTimer = useRef<gsap.core.Tween | null>(null);
  const { contextSafe } = useGSAP(
    () => () => {
      resetTimer.current?.kill();
    },
    { scope: root },
  );

  const celebrate = contextSafe(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;
    gsap.fromTo(
      "[data-icon]",
      { scale: 0.5, rotate: -25 },
      { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2.4)" },
    );
    gsap.fromTo(
      "[data-ring]",
      { scale: 0.6, autoAlpha: 0.7 },
      { scale: 1.8, autoAlpha: 0, duration: 0.6, ease: "power2.out" },
    );
  });

  const handleCopy = async () => {
    try {
      await copyText(text);
      setStatus("copied");
      // Wait a frame so React has rendered the check icon before animating it.
      requestAnimationFrame(celebrate);
    } catch {
      setStatus("error");
    }
    resetTimer.current?.kill();
    resetTimer.current = gsap.delayedCall(2, () => setStatus("idle"));
  };

  const message =
    status === "copied"
      ? "Copied to clipboard"
      : status === "error"
        ? "Copy failed"
        : "";

  return (
    <span ref={root} className={styles.root}>
      <button
        type="button"
        onClick={handleCopy}
        className={`${styles.button} ${status === "copied" ? styles.copied : ""}`}
        aria-label={label}
        title="Copy to clipboard"
      >
        <span className={styles.ring} data-ring aria-hidden="true" />
        <span className={styles.icon} data-icon aria-hidden="true">
          {status === "copied" ? <CheckIcon /> : <CopyIcon />}
        </span>
      </button>
      <span className={styles.toast} aria-live="polite" role="status">
        {message}
      </span>
    </span>
  );
}

function CopyIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** Clipboard API first; legacy execCommand fallback for non-secure contexts. */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const previous = document.activeElement as HTMLElement | null;
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    previous?.focus();
    if (!ok) throw new Error("Copy failed");
  }
}
