import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PortfolioProvider } from "../lib/portfolio-context";
import Navigation from "../components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Circularity Matrix — Strategy Advisor",
  description:
    "Identify the right circular economy strategy (RPO, PLE, DFR) for your products using the HBR Circularity Matrix framework.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <PortfolioProvider>
          <Navigation />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
        </PortfolioProvider>
      </body>
    </html>
  );
}
