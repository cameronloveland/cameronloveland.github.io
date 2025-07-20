'use client';

import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { AudioToggle } from './audio';

export default function Header() {
    return (
        <header className=" z-50 fixed top-0 left-0 w-full bg-neutral-950/80 backdrop-blur border-neutral-900 fade-in-delayed transition-colors duration-300 opacity-0">

            <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4 relative" >
                {/* Left: Logo */}
                <a
                    href="https://github.com/cameronloveland"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-style flex items-center gap-3"
                    aria-label="GitHub Portfolio"
                >
                    <img
                        src="https://github.com/cameronloveland.png"
                        alt="Cameron Loveland"
                        className="w-8 h-8 rounded-full border-2 border-neutral-700 shadow-sm"
                    />
                    <span className="font-bold text-lg tracking-tight">
                        <span className="text-accent">cameron</span>
                        <span className="text-secondary">.loveland</span>
                        <span className="text-neutral-400"> / portfolio</span>
                    </span>
                </a>

                {/* Center: Social icons */}
                <div className="hidden sm:flex items-center gap-3 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <a
                        href="https://github.com/cameronloveland"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button-style"
                        aria-label="GitHub"
                    >
                        <FaGithub className="text-lg" />
                    </a>
                    {/* <a
                      href="https://linkedin.com/in/your-linkedin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-style"
                      aria-label="LinkedIn"
                  >
                      <FaLinkedin className="text-lg" />
                  </a> */}
                </div>

                {/* Right: Audio toggle */}
                <AudioToggle />
            </div>
        </header>
    );
}
