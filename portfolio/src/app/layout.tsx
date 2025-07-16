import type { Metadata } from "next";
import "../styles/theme.css";
import "../styles/fonts.css";
import "../styles/radioPlayer.css";
import "../styles/animations.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

import Header from "../components/Header";
import { Footer } from "../components/Footer";
import ParallaxHandler from "../components/ParallaxHandler";

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
      <body className="antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-cyan-500 text-black px-4 py-2 rounded z-50">
          Skip to main content
        </a>
        <ParallaxHandler>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ParallaxHandler>
      </body>
    </html>
  );
}
