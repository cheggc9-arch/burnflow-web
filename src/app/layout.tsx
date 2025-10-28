import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/lib/background-job"; // Initialize background job

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BURNFLOW",
  description: "Automated token burning system that reduces supply through systematic buyback and burn operations on Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/logo.svg" type="image/svg+xml" />
        <meta property="og:title" content="BURNFLOW" />
        <meta property="og:description" content="Automated token burning system that reduces supply through systematic buyback and burn operations on Solana." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BURNFLOW" />
        <meta name="twitter:description" content="Automated token burning system that reduces supply through systematic buyback and burn operations on Solana." />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        {children}
      </body>
    </html>
  );
}