import type { Metadata, Viewport } from "next";
import { Unbounded, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const SITE_URL = "https://voice.mykamra.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "MyKamra Voice Fountain — Loudness, Pitch & DJ Light Test",
  description:
    "Speak and watch a fountain rise with your volume and change color with your pitch. Plus a full-screen DJ Light mode that reacts to any music playing on your laptop.",
  keywords: [
    "voice test",
    "loudness test",
    "voice frequency test",
    "pitch test",
    "dj light",
    "audio visualizer",
    "mykamra",
  ],
  applicationName: "MyKamra Voice Fountain",
  manifest: "/manifest.json",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "MyKamra Voice Fountain",
    title: "MyKamra Voice Fountain",
    description: "Speak. Watch a fountain rise with your volume and glow with your pitch.",
    url: SITE_URL,
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#05060A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${unbounded.variable} ${inter.variable} ${spaceMono.variable} font-inter antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
