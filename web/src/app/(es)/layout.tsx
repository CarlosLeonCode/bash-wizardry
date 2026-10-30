import LeadCard from "@/components/LeadCard";
import RootDocument from "@/components/RootDocument";
import { getDictionary } from "@/lib/i18n";
import { LEADS_ENABLED } from "@/lib/leads";
import { buildMetadata, viewport as sharedViewport } from "@/lib/i18n/metadata";

export const viewport = sharedViewport;

export const metadata = buildMetadata("es");

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RootDocument locale="es">
      {children}
      {/* Optional "get updates" card (src/lib/leads.ts). */}
      {LEADS_ENABLED && (
        <LeadCard locale="es" t={getDictionary("es").leads} />
      )}
    </RootDocument>
  );
}
