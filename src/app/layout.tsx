import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LomaX NEO — The Financial Singularity OS",
  description: "A living, breathing financial nervous system that anticipates your needs, learns from your behavior, and acts autonomously to grow your wealth while protecting you from risk.",
  keywords: ["fintech", "AI CFO", "digital twin", "holographic finance", "UPI", "post-quantum"],
  manifest: "/manifest.json",
  themeColor: "#00e5ff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LomaX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
