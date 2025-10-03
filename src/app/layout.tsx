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
  title: "REWARDFLOW",
  description: "Advanced algorithms distribute creator fees to token holders. Automated, transparent, and fair reward distribution on Solana.",
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
        <meta property="og:title" content="REWARDFLOW" />
        <meta property="og:description" content="Automated token reward distribution. Advanced algorithms reward holders with creator fees from Pump.fun trading." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="REWARDFLOW" />
        <meta name="twitter:description" content="Automated token reward distribution. Advanced algorithms reward holders with creator fees from Pump.fun trading." />
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