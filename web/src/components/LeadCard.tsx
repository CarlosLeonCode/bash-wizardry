"use client";

// The package stylesheet goes first so LeadCard.module.css can refine it.
import "@carlosleoncode/lead-capture/styles.css";
import {
  LeadCapture,
  type LeadCaptureTheme,
} from "@carlosleoncode/lead-capture";
import { PRIVACY_PATH, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import {
  LEAD_EVENT_COPY_INSTALL,
  LEADS_ENABLED,
  LEADS_ENDPOINT,
  LEADS_PROJECT,
} from "@/lib/leads";
import styles from "./LeadCard.module.css";

/**
 * Phosphor-terminal theme (values from globals.css). Text pairs on the
 * #050b06 panel: #b9ffcb 16:1, #1fae4a 6.8:1, #021a08 on #39ff6a 13.6:1.
 */
const THEME: LeadCaptureTheme = {
  accent: "#39ff6a",
  accentText: "#021a08",
  background: "#050b06",
  text: "#b9ffcb",
  mutedText: "#1fae4a",
  border: "#4c8f5e",
  fieldBackground: "#020502",
  radius: "2px",
  font: "var(--font-mono)",
  shadow:
    "0 0 0 1px rgba(57, 255, 106, 0.06), 0 0 24px rgba(57, 255, 106, 0.12), 0 18px 48px rgba(0, 0, 0, 0.7)",
};

/**
 * The optional "get updates" card. Mounted once per locale layout; renders
 * nothing unless LEADS_ENABLED (endpoint set and package installed). It asks
 * on its own only after the install command is copied (InstallCopyButton),
 * or when the footer button opens it (LeadUpdatesButton).
 */
export default function LeadCard({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary["leads"];
}) {
  if (!LEADS_ENABLED) return null;

  return (
    <LeadCapture
      project={LEADS_PROJECT}
      endpoint={LEADS_ENDPOINT}
      productName="bash-wizardry"
      privacyUrl={PRIVACY_PATH[locale]}
      source="landing"
      policy={{ triggerEvents: [LEAD_EVENT_COPY_INSTALL], triggerCount: 1 }}
      copy={t.card}
      roles={t.roles}
      countries="all"
      countryNamesLocale={locale}
      theme={THEME}
      className={styles.card}
    />
  );
}
