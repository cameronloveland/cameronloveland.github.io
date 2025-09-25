"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const navigation = [
  { name: "Home", href: "#top" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-brand-midnight transition hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          onClick={closeMenu}
        >
          Cameron Loveland
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-brand-midnight sm:flex" aria-label="Primary">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="rounded-full px-3 py-2 transition hover:text-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {item.name}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full p-2 text-brand-midnight transition hover:text-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:hidden"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          onClick={toggleMenu}
        >
          {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>
      </div>
      {isOpen ? (
        <div className="border-t border-slate-200 bg-white sm:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-brand-midnight transition hover:bg-slate-100 hover:text-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                onClick={closeMenu}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
