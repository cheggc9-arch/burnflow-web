import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RewardFlow Burn - Token Burn Dashboard",
  description: "Automated token burn system for RewardFlow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
