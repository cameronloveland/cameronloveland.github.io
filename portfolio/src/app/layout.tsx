import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/theme.css";
import "./styles/fonts.css";
import "./styles/animations.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,  // ✅ prevents fetch on build
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false, // ✅ prevents fetch on build
});

export const metadata: Metadata = {
  title: "Portfolio | Cameron Loveland",
  description: "Beefed up github pages portfolio with interactive elements and animations.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
