import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { env } from "@/lib/env";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", axes: ["opsz", "SOFT"], display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: "Oh-TEN-tic! Paskorisyuhan 2026", template: "%s · Oh-TEN-tic! Paskorisyuhan 2026" },
  description:
    "Official website of CCES Interbatch Paskorisyuhan 2026 — “Oh-TEN-tic Fun, Christmas for Everyone!” Hosted by Batch 2010, Can-avid, Eastern Samar. Featuring the Oh-TEN-tic! Fun Run on December 5, 2026.",
  openGraph: { type: "website", siteName: "Oh-TEN-tic! Paskorisyuhan 2026", locale: "en_PH" },
};

export const viewport: Viewport = { themeColor: "#4E0C18", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
