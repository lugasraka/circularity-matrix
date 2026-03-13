"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PortfolioProvider, usePortfolio } from "../lib/portfolio-context";
import Navigation from "../components/Navigation";
import OnboardingModal from "../components/OnboardingModal";
import HelpPanel from "../components/HelpPanel";
import { useState, useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Wrapper component to access portfolio context
function LayoutContent({ children }: { children: React.ReactNode }) {
  const { hasSeenOnboarding, markOnboardingSeen } = usePortfolio();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // Show onboarding after a short delay if user hasn't seen it
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenOnboarding]);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    markOnboardingSeen();
  };

  return (
    <>
      <Navigation onHelpClick={() => setShowHelp(true)} />
      <main className="min-h-[calc(100vh-64px)]">{children}</main>

      {showOnboarding && <OnboardingModal onClose={handleOnboardingClose} />}
      <HelpPanel isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
}

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
          <LayoutContent>{children}</LayoutContent>
        </PortfolioProvider>
      </body>
    </html>
  );
}
