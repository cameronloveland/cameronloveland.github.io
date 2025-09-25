import type { Metadata } from "next";
import "../styles/theme.css";
import "../styles/fonts.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Portfolio | Cameron Loveland",
  description: "Cameron Loveland is a software engineer who builds thoughtful, user-first experiences.",
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
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan"
        >
          Skip to main content
        </a>
        <div className="flex min-h-screen flex-col" id="top">
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
