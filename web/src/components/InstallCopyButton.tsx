"use client";

import { recordLeadEvent } from "@carlosleoncode/lead-capture";
import CopyButton from "@/components/CopyButton";
import { LEAD_EVENT_COPY_INSTALL, LEADS_ENABLED } from "@/lib/leads";

/**
 * CopyButton for the install command. A successful copy is the site's value
 * moment: it may show the optional "get updates" card (see LeadCard).
 */
export default function InstallCopyButton(
  props: Omit<React.ComponentProps<typeof CopyButton>, "onCopied">,
) {
  return (
    <CopyButton
      {...props}
      onCopied={
        LEADS_ENABLED
          ? () => recordLeadEvent(LEAD_EVENT_COPY_INSTALL)
          : undefined
      }
    />
  );
}
