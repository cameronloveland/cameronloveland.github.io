import Link from "next/link";

const footerLinks = [
  { name: "GitHub", href: "https://github.com/cameronloveland" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/cameronloveland" },
  { name: "Email", href: "mailto:hello@cameronloveland.dev" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} Cameron Loveland. All rights reserved.</p>
        <ul className="flex gap-4">
          {footerLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="rounded-full px-3 py-2 transition hover:bg-cyan-100 hover:text-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
