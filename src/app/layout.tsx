import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vadlycv.my.id"),
  title: "Fadli (Muhammad Ryan Fadliansyah) — Creative Producer & AI Video Strategist",
  description:
    "Creative Producer & AI-Assisted Video Strategist. Scaled TikTok growth to 120K+ followers and 5M+ organic views, produced monetized YouTube music channels, and integrate AI creative workflows.",
  openGraph: {
    title: "Fadli — Creative Producer & AI Video Strategist",
    description:
      "120K+ TikTok followers, 5M+ organic views, YouTube production, Studio One audio mixing, and AI-assisted workflows.",
    url: "https://www.vadlycv.my.id",
    siteName: "Fadli Portfolio",
    type: "website",
    images: [{ url: "/images/profile-main.png", width: 800, height: 1000 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
