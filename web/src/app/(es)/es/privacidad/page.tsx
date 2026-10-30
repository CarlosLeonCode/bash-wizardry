import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PrivacyPage from "@/components/PrivacyPage";
import { buildPrivacyMetadata } from "@/lib/i18n/metadata";
import { LEADS_ENABLED } from "@/lib/leads";
import { assertPrivacyReady } from "@/lib/site";

// Fails a production build while PRIVACY (src/lib/site.ts) still has "TODO"
// values and the subscription is on (src/lib/leads.ts). Without it nothing is
// collected, so this page is a 404 and the build passes.
assertPrivacyReady(LEADS_ENABLED);

export const metadata: Metadata = LEADS_ENABLED
  ? buildPrivacyMetadata("es")
  : {};

export default function Page() {
  if (!LEADS_ENABLED) notFound();
  return <PrivacyPage locale="es" />;
}
