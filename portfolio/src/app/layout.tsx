import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/theme.css";
import "./styles/fonts.css";
import "./styles/animations.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

import Header from "./components/Header";
import { Footer } from "./components/Footer";
import ParallaxHandler from "./components/ParallaxHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Portfolio | Cameron Loveland",
  description: "Beefed up GitHub Pages portfolio with interactive elements and animations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://github.com/cameronloveland.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ParallaxHandler>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ParallaxHandler>
      </body>
    </html>
  );
}
