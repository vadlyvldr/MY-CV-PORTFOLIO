import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  JetBrains_Mono,
  Manrope,
} from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vadlycv.my.id"),
  title: "Fadli — Creative Producer & AI-Assisted Video Strategist",
  description:
    "Creative Producer & AI-Assisted Video Strategist. Scaled TikTok growth to 120K+ followers and 5M+ organic views, launched monetized YouTube channels, and build AI-assisted creative workflows.",
  openGraph: {
    title: "Fadli — Creative Producer & AI-Assisted Video Strategist",
    description:
      "120K+ TikTok followers, 5M+ organic views, YouTube production, Studio One mixing, and AI workflows.",
    url: "https://www.vadlycv.my.id",
    siteName: "Fadli Studio",
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
      className={`${bricolage.variable} ${instrumentSerif.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col selection:bg-[var(--accent)] selection:text-white">
        {children}
      </body>
    </html>
  );
}
