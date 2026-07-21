import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Orbitron,
} from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ADOKVA — Ты не один",
  description:
    "Исследуй мир и находи связь с местом, где ты родился.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        ${orbitron.variable}
        h-full
        antialiased
      `}
    >
      <body
        className="min-h-full flex flex-col"
        style={{
          margin: 0,
          background: "#000000",
          fontFamily:
            "var(--font-geist-sans), Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}