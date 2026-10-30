"use client";

import { useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import type { CopyButtonCopy } from "@/lib/i18n/types";
import styles from "./CopyButton.module.css";

type Status = "idle" | "copied" | "error";

const GLYPHS: Record<Status, string> = {
  idle: "⏎",
  copied: "✔",
  error: "✖",
};

/**
 * Keycap-style copy button. "key" fills the right edge of a command box;
 * "compact" is a small bracketed key for secondary commands.
 */
export default function CopyButton({
  text,
  label,
  variant = "key",
  t,
  onCopied,
}: {
  text: string;
  label: string;
  variant?: "key" | "compact";
  /** Localized keycap, tooltip and live-region text. */
  t: CopyButtonCopy;
  /** Called after the text reached the clipboard (not on failure). */
  onCopied?: () => void;
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

  const flash = contextSafe(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;
    gsap.fromTo(
      "button",
      { boxShadow: "0 0 0 0 rgba(57, 255, 106, 0.9)" },
      {
        boxShadow: "0 0 0 10px rgba(57, 255, 106, 0)",
        duration: 0.5,
        ease: "power2.out",
        clearProps: "boxShadow",
      },
    );
  });

  const handleCopy = async () => {
    try {
      await copyText(text);
      setStatus("copied");
      flash();
      onCopied?.();
    } catch {
      setStatus("error");
    }
    resetTimer.current?.kill();
    resetTimer.current = gsap.delayedCall(2, () => setStatus("idle"));
  };

  const message =
    status === "copied"
      ? t.copiedMessage
      : status === "error"
        ? t.errorMessage
        : "";
  const keycap = t[status];

  return (
    <span ref={root} className={`${styles.root} ${styles[variant]}`}>
      <button
        type="button"
        onClick={handleCopy}
        className={styles.button}
        data-status={status}
        aria-label={label}
        title={t.title}
      >
        <span aria-hidden="true">
          {variant === "compact" ? (
            <>[ {keycap.toLowerCase()} ]</>
          ) : (
            <>
              {GLYPHS[status]} {keycap}
            </>
          )}
        </span>
      </button>
      <span className="sr-only" aria-live="polite" role="status">
        {message}
      </span>
    </span>
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
