import LeadCard from "@/components/LeadCard";
import RootDocument from "@/components/RootDocument";
import { getDictionary } from "@/lib/i18n";
import { LEADS_ENABLED } from "@/lib/leads";
import { buildMetadata, viewport as sharedViewport } from "@/lib/i18n/metadata";

export const viewport = sharedViewport;

export const metadata = buildMetadata("en");

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RootDocument locale="en">
      {children}
      {/* Optional "get updates" card (src/lib/leads.ts). */}
      {LEADS_ENABLED && (
        <LeadCard locale="en" t={getDictionary("en").leads} />
      )}
    </RootDocument>
  );
}
