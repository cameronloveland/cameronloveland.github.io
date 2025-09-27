import type { Metadata } from "next";
import "../styles/global.css";

export const metadata: Metadata = {
  title: "Cameron Loveland | Software Engineer",
  description:
    "Minimal, focused portfolio for Cameron Loveland — featuring highlighted projects and space for long-form updates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
