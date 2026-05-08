import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Footer } from "@/components/Footer";
import { TopNav } from "@/components/TopNav";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "PeptSight — Real-time peptide intelligence",
  description:
    "AI-agent-powered peptide ecosystem intelligence. Educational research aggregation: trends, sentiment, market signals, claim consistency.",
  applicationName: "PeptSight",
  authors: [{ name: "PeptSight" }],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-bg-base text-ink-primary font-sans antialiased">
        <DisclaimerBanner />
        <TopNav />
        <main className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
