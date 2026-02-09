import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BodyRouteClass from "@/components/BodyRouteClass";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PostSoma 2050 | Cyberpunk-Humanist Knowledge Garden",
  description:
    "High-Tech meets High-Touch. AI, Blockchain, Philosophy, Investing, Notes.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetbrainsMono.variable} ${inter.variable} min-h-screen bg-bg font-sans text-text-primary antialiased`}
      >
        <BodyRouteClass />
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
        <footer className="relative z-10 mt-24 border-t border-white/5 py-12 text-center">
          <div className="flex flex-col items-center space-y-2 font-mono text-sm tracking-wider">
            <p className="text-cyan-400/90 drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
              At PostSoma-2050,
            </p>
            <p className="text-gray-500">Together, we gaze into the abyss,</p>
            <p className="text-gray-500">
              Rediscovering the essence of our existence.
            </p>
            <p className="mt-12 text-[10px] uppercase tracking-widest text-gray-700">
              © 2050 PostSoma-2050. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
