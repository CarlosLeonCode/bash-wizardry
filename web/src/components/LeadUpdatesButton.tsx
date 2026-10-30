"use client";

import { openLeadCapture } from "@carlosleoncode/lead-capture";
import { LEADS_PROJECT } from "@/lib/leads";

/**
 * Manual trigger for the "get updates" card. Render it only when
 * LEADS_ENABLED, so builds without the subscription show no dead button.
 */
export default function LeadUpdatesButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={() => openLeadCapture({ project: LEADS_PROJECT })}
    >
      [ {label} ]
    </button>
  );
}
