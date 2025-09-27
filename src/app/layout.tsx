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
  title: "hold2earn",
  description: "Rewarding all holders with creator fees from Pump.fun! More volume, more fees distributed!",
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
        <meta property="og:title" content="hold2earn" />
        <meta property="og:description" content="Rewarding all holders with creator fees from Pump.fun! More volume, more fees distributed!" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="hold2earn" />
        <meta name="twitter:description" content="Rewarding all holders with creator fees from Pump.fun! More volume, more fees distributed!" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
