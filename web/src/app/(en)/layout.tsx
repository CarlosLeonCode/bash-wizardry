import RootDocument from "@/components/RootDocument";
import { buildMetadata, viewport as sharedViewport } from "@/lib/i18n/metadata";

export const viewport = sharedViewport;

export const metadata = buildMetadata("en");

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
