import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LomaX NEO — The Financial Singularity OS",
  description: "A living, breathing financial nervous system that anticipates your needs, learns from your behavior, and acts autonomously to grow your wealth while protecting you from risk.",
  keywords: ["fintech", "AI CFO", "digital twin", "holographic finance", "UPI", "post-quantum"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LomaX",
  },
};

export const viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
