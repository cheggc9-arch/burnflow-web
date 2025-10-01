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
  title: "MATRIX REWARDS",
  description: "Enter the Matrix of automated token distribution. Advanced algorithms reward holders with creator fees from the digital realm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon.ico" sizes="any" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="192x192" type="image/png" />
        <meta property="og:title" content="MATRIX REWARDS" />
        <meta property="og:description" content="Enter the Matrix of automated token distribution. Advanced algorithms reward holders with creator fees from the digital realm." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MATRIX REWARDS" />
        <meta name="twitter:description" content="Enter the Matrix of automated token distribution. Advanced algorithms reward holders with creator fees from the digital realm." />
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
