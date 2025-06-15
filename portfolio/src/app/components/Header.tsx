export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full z-20 bg-neutral-950/80 backdrop-blur border-b border-neutral-900 rounded-b-2xl">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                {/* Site title */}
                <span className="text-white font-bold text-lg tracking-tight">Portfolio</span>

                {/* Navigation */}
                <nav className="flex items-center gap-6">
                    <a
                        href="#projects"
                        className="text-neutral-400 hover:text-white transition font-medium"
                    >
                        Projects
                    </a>
                    {/* Social icons using Font Awesome 6 */}
                    <a
                        href="https://github.com/cameronloveland"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-white transition"
                        aria-label="GitHub"
                    >
                        <i className="fab fa-github text-lg"></i>
                    </a>
                    <a
                        href="https://linkedin.com/in/your-linkedin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-white transition"
                        aria-label="LinkedIn"
                    >
                        <i className="fab fa-linkedin text-lg"></i>
                    </a>
                    <a
                        href="https://twitter.com/your-twitter"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-white transition"
                        aria-label="Twitter"
                    >
                        <i className="fab fa-x-twitter text-lg"></i>
                    </a>
                </nav>
            </div>
        </header >
    )
}; 