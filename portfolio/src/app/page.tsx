// page.tsx
import React from 'react';
import { Repo } from './Repo';
import { CaptainsLogSidebar } from './components/CaptainsLogSidebar';
import { getTopicIcon } from './lib/getTopicIcon';
import { getReposWithReadme } from './lib/getReposWithReadme';

export default async function Home() {
  const repos = await getReposWithReadme();

  return (
    <div className="relative min-h-screen bg-neutral-950 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-20 bg-neutral-950/80 backdrop-blur border-b border-neutral-900">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Site title */}
          <span className="text-white font-bold text-lg tracking-tight">Cameron Loveland</span>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <a
              href="#projects"
              className="text-neutral-400 hover:text-white transition font-medium"
            >
              Projects
            </a>
            <a
              href="#blog"
              className="text-neutral-400 hover:text-white transition font-medium"
            >
              Blog
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
      </header>


      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-12 pt-28">
        {/* Hero Section */}
        <section id="about" className="w-full max-w-2xl flex flex-col items-center text-center mb-8">
          <img
            src="https://github.com/cameronloveland.png"
            alt="Cameron Loveland"
            className="w-24 h-24 rounded-full border-4 border-neutral-800 shadow mb-6"
          />
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Cameron Loveland
          </h1>
          <p className="text-neutral-400 text-lg mb-4">
            Software Engineer
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="https://github.com/cameronloveland"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition"
            >
              <svg width="24" height="24" fill="currentColor" className="inline-block"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.41-5.25 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" /></svg>
            </a>
          </div>
        </section>

        {/* Projects Grid */}
        <section id="projects" className="w-full max-w-6xl mb-16">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {repos.slice(0, 6).map((repo: Repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="block bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow hover:shadow-lg transition group"
              >
                <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-blue-400 transition">
                  {repo.name}
                </h3>
                <p className="text-neutral-400 text-sm mb-2">
                  {repo.readmeSummary || <span className="italic text-neutral-600">No description</span>}
                </p>

                <div>
                  {(repo.topics?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {repo.topics?.map((topic) => (
                        <span
                          key={topic}
                          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700 transition"
                        >
                          {getTopicIcon(topic)}
                          <span className="ml-0.5">{topic}</span> {/* <— preserves original casing */}
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              </a>

            ))}
          </div>
        </section>

        {/* Blog Section */}
        <CaptainsLogSidebar />

        {/* Contact Section */}
        <section id="contact" className="w-full max-w-2xl flex flex-col items-center text-center mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Contact</h2>
          <p className="text-neutral-400 mb-2">
            Feel free to reach out via{' '}
            <a
              href="mailto:cameronloveland@gmail.com"
              className="text-blue-400 hover:underline"
            >
              email
            </a>
            .
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-900 py-6 mt-12 text-center text-neutral-500 text-sm">
        &copy; {new Date().getFullYear()} Cameron Loveland. All rights reserved.
      </footer>
    </div>
  );
}
