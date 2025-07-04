import type { Metadata } from "next";
import "../styles/theme.css";
import "../styles/fonts.css";
import "../styles/animations.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

import Header from "../components/Header";
import { Footer } from "../components/Footer";
import ParallaxHandler from "../components/ParallaxHandler";
import ARPanels from "../components/ARPanels";

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
        <ParallaxHandler>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ARPanels />
        </ParallaxHandler>
      </body>
    </html>
  );
}
