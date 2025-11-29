import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haipe Flow",
  description: "The next generation of creative tools for modern teams.",
};

import { Purchases } from "@revenuecat/purchases-js";

const appUserId = Purchases.generateRevenueCatAnonymousAppUserId();
const purchases = Purchases.configure({
  apiKey: "test_pYEVmvQOErZDyCQBRxDvZoybWbB",
  appUserId: appUserId,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
