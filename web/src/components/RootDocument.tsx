import type { ReactNode } from "react";
import { JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";
import Crt from "@/components/Crt";
import SeasonalAmbience from "@/components/SeasonalAmbience";
import type { Locale } from "@/lib/i18n";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

/**
 * The <html> shell shared by every locale's root layout. Each locale has its
 * own root layout (app/(en) and app/(es)) so <html lang> is right in the
 * static HTML without a [lang] segment or a rewrite.
 */
export default function RootDocument({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <html lang={locale} className={jetbrainsMono.variable}>
      <body>
        {children}
        <Crt />
        {/* After the CRT glow: same layer, painted above it. */}
        <SeasonalAmbience />
      </body>
    </html>
  );
}
