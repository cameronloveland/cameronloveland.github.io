import { FiGithub, FiLinkedin } from "react-icons/fi";

const socials = [
  {
    name: "GitHub",
    href: "https://github.com/cameronloveland",
    icon: FiGithub,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/cameronloveland/",
    icon: FiLinkedin,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-medium text-slate-600">© {new Date().getFullYear()} Cameron Loveland. All rights reserved.</p>
        <div className="flex items-center gap-4">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-semibold text-slate-600 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span>{social.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
