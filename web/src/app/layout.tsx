import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Background from "@/components/Background";
import { SITE_URL } from "@/lib/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "A curated suite of context-aware shell spells for Bash and Zsh: Magic Workspaces, Git, Node.js, Docker, Rails and Django. Pure shell, no binaries, 100% under your control.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bash Wizardry | Intelligent CLI Spells",
    template: "%s | Bash Wizardry",
  },
  description,
  keywords: [
    "bash",
    "zsh",
    "terminal",
    "cli",
    "shell aliases",
    "productivity",
    "developer tools",
    "git",
    "docker",
    "node.js",
  ],
  authors: [
    { name: "Carlos Leon Code", url: "https://github.com/CarlosLeonCode" },
  ],
  creator: "Carlos Leon Code",
  publisher: "Carlos Leon Code",
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Bash Wizardry | Intelligent CLI Spells",
    description,
    url: "/",
    siteName: "Bash Wizardry",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bash Wizardry | Intelligent CLI Spells",
    description,
    creator: "@CarlosLeonCode",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // The manifest link is emitted automatically from app/manifest.ts
  // (served at /manifest.webmanifest), so it is not declared here.
};

export const viewport: Viewport = {
  themeColor: "#07060f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Background />
        {children}
      </body>
    </html>
  );
}
