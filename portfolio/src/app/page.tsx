// page.tsx
import React from 'react';
import { Repo } from './Repo';

async function getReposWithReadme() {
  const response = await fetch('https://api.github.com/users/cameronloveland/repos', {
    headers: { Accept: 'application/vnd.github.v3+json' },
  });
  if (!response.ok) throw new Error('Failed to fetch repos');
  const repos: Repo[] = await response.json();

  // Fetch README for each repo and extract the first paragraph
  const reposWithReadme = await Promise.all(
    repos.map(async (repo) => {
      try {
        const readmeRes = await fetch(
          `https://api.github.com/repos/cameronloveland/${repo.name}/readme`,
          { headers: { Accept: 'application/vnd.github.v3.raw' } }
        );
        if (!readmeRes.ok) return { ...repo, readmeSummary: repo.description || "" };
        const readme = await readmeRes.text();
        // Extract the first non-empty line (or paragraph)
        const summary =
          readme
            .split(/\r?\n\r?\n/) // split by paragraphs
            .map((s) => s.trim())
            .find((s) => s && !s.startsWith('#')) || repo.description || "";
        return { ...repo, readmeSummary: summary };
      } catch {
        return { ...repo, readmeSummary: repo.description || "" };
      }
    })
  );

  return reposWithReadme;
}

// Dummy blog posts data
const blogPosts = [
  {
    title: "How I Built My Portfolio with Next.js",
    date: "2024-06-01",
    summary: "A walkthrough of building a modern developer portfolio using Next.js, Tailwind CSS, and GitHub Actions.",
    url: "#"
  },
  {
    title: "Tips for Clean React Code",
    date: "2024-05-15",
    summary: "My favorite patterns and best practices for writing maintainable React code.",
    url: "#"
  },
  {
    title: "Automating Deployments with GitHub Actions",
    date: "2024-04-20",
    summary: "How to set up CI/CD for your static sites using GitHub Actions.",
    url: "#"
  }
];

export default async function Home() {
  const repos = await getReposWithReadme();

  return (
    <div className="relative min-h-screen bg-neutral-950 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-20 bg-neutral-950/80 backdrop-blur border-b border-neutral-900">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <span className="text-white font-bold text-lg tracking-tight">Cameron Loveland</span>
          <nav className="flex items-center gap-6">
            <a
              href="#about"
              className="text-neutral-400 hover:text-white transition font-medium"
            >
              About
            </a>
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
            <a
              href="#contact"
              className="text-neutral-400 hover:text-white transition font-medium"
            >
              Contact
            </a>
            <a
              href="https://github.com/cameronloveland"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition"
              aria-label="GitHub"
            >
              <svg width="24" height="24" fill="currentColor" className="inline-block"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.41-5.25 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/></svg>
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
              <svg width="24" height="24" fill="currentColor" className="inline-block"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.41-5.25 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/></svg>
            </a>
          </div>
        </section>

        {/* Tech Stack Banner */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {/* React */}
          <span className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-white text-sm font-medium shadow">
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="3" fill="#61DAFB"/><g stroke="#61DAFB" strokeWidth="2" fill="none"><ellipse rx="18" ry="7" cx="20" cy="20" transform="rotate(60 20 20)"/><ellipse rx="18" ry="7" cx="20" cy="20" transform="rotate(120 20 20)"/><ellipse rx="18" ry="7" cx="20" cy="20"/></g></svg>
            React
          </span>
          {/* Next.js */}
          <span className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-white text-sm font-medium shadow">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#fff"/><path d="M7 16c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9zm13.5 4.5L12 12" stroke="#000" strokeWidth="2" strokeLinecap="round"/></svg>
            Next.js
          </span>
          {/* Tailwind CSS */}
          <span className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-white text-sm font-medium shadow">
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none"><path d="M24 18c-4 0-6.7 2-8 6 1.3-2 3.3-3 6-3 2.1 0 3.7 1.1 4.8 3.2C28.7 27.1 30.3 28 32 28c4 0 6.7-2 8-6-1.3 2-3.3 3-6 3-2.1 0-3.7-1.1-4.8-3.2C27.3 20.9 25.7 20 24 20z" fill="#38BDF8"/><path d="M16 30c-4 0-6.7 2-8 6 1.3-2 3.3-3 6-3 2.1 0 3.7 1.1 4.8 3.2C20.7 39.1 22.3 40 24 40c4 0 6.7-2 8-6-1.3 2-3.3 3-6 3-2.1 0-3.7-1.1-4.8-3.2C19.3 31.9 17.7 31 16 31z" fill="#38BDF8"/></svg>
            TailwindCSS
          </span>
          {/* Copilot */}
          <span className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-white text-sm font-medium shadow">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="#24292F"/><circle cx="10.5" cy="13.5" r="2.5" fill="#A5D6FF"/><circle cx="21.5" cy="13.5" r="2.5" fill="#A5D6FF"/><path d="M8 18c0 3 3.6 5 8 5s8-2 8-5" stroke="#A5D6FF" strokeWidth="2" strokeLinecap="round"/></svg>
            Copilot
          </span>
          {/* Codex */}
          <span className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-white text-sm font-medium shadow">
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none"><rect x="6" y="6" width="28" height="28" rx="6" fill="#fff"/><path d="M14 20h12M20 14v12" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/></svg>
            Codex
          </span>
          {/* ChatGPT */}
          <span className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-white text-sm font-medium shadow">
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" stroke="#10A37F" strokeWidth="3"/><path d="M20 10v10l7 7" stroke="#10A37F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ChatGPT
          </span>
        </div>

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
              </a>
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="w-full max-w-3xl mb-16">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Blog</h2>
          <ul className="divide-y divide-neutral-800">
            {blogPosts.map((post) => (
              <li key={post.title} className="py-6 flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex-1">
                  <a
                    href={post.url}
                    className="block text-lg font-semibold text-white hover:text-blue-400 transition"
                  >
                    {post.title}
                  </a>
                  <p className="text-neutral-400 text-sm mt-1">{post.summary}</p>
                </div>
                <div className="sm:text-right text-neutral-500 text-xs sm:w-32 mt-2 sm:mt-0">
                  {new Date(post.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </li>
            ))}
          </ul>
        </section>

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
