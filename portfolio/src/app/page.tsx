// page.tsx
import React, { JSX } from 'react';
import { Repo } from './Repo';
import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiGithub,
  SiDocker,
  SiPython,
  SiVercel,
  SiGraphql,
  SiOpenai,
  SiFirebase,
  SiHtml5,
  SiCss3,
} from "react-icons/si";
import { IconType } from "react-icons";
import CaptainsLogSidebar from './components/CaptainsLogSidebar';

async function getReposWithReadme() {
  const response = await fetch('https://api.github.com/users/cameronloveland/repos', {
    headers: { Accept: 'application/vnd.github.mercy-preview+json' },
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


const topicIconMap: Record<string, IconType> = {
  react: SiReact,
  nextjs: SiNextdotjs,
  tailwindcss: SiTailwindcss,
  javascript: SiJavascript,
  typescript: SiTypescript,
  node: SiNodedotjs,
  github: SiGithub,
  docker: SiDocker,
  python: SiPython,
  vercel: SiVercel,
  graphql: SiGraphql,
  openai: SiOpenai,
  firebase: SiFirebase,
  html: SiHtml5,
  css: SiCss3,
};

const topicColorMap: Record<string, string> = {
  react: "#61DAFB",
  nextjs: "#000000",
  tailwindcss: "#38BDF8",
  javascript: "#F7DF1E",
  typescript: "#3178C6",
  node: "#339933",
  github: "#181717",
  docker: "#2496ED",
  python: "#3776AB",
  vercel: "#000000",
  graphql: "#E10098",
  openai: "#10A37F",
  firebase: "#FFCA28",
  html: "#E34F26",
  css: "#1572B6",
};

export function getTopicIcon(topic: string): JSX.Element {
  const key = topic.toLowerCase();
  const Icon = topicIconMap[key] || SiGithub;
  const color = topicColorMap[key] || "#999999";

  return <Icon className="text-sm" style={{ color }} />;
}



// Dummy blog posts data
const blogPosts = [
  {
    title: "Building My Portfolio with Next.js and Tailwind",
    date: "2024-06-10",
    summary: "In this post, I walk through how I worked with ChatGPT to build my new portfolio site using Next.js, Tailwind CSS, Copilot, and Codex. I detail every step we took to get to the final result, including dynamically pulling GitHub data and setting up automated deployments.",
    url: "#"
  },
  {
    title: "Automating Deployment with GitHub Actions and GitHub Pages",
    date: "2024-06-10",
    summary: "This post covers how to set up a simple GitHub Actions workflow to build and deploy a static site to GitHub Pages, including setting up a deploy YAML file, caching Node dependencies, and ensuring your site is always up to date.",
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

// Helper: Returns an array of {icon, name} for a given repo
function getTechIconsForRepo(repo: Repo) {
  // Example: Map repo names to tech stacks. Adjust as needed!
  const stack: Record<string, string[]> = {
    "your-nextjs-repo": ["nextjs", "react", "tailwind", "copilot"],
    "your-codex-repo": ["codex", "react"],
    "your-chatgpt-repo": ["chatgpt", "react"],

  };

  const techs = stack[repo.name] ?? [];
  return techs.map((tech) => {
    switch (tech) {
      case "react":
        return (
          <span title="React" key="react">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none" className="inline align-middle mr-1"><circle cx="20" cy="20" r="3" fill="#61DAFB" /><g stroke="#61DAFB" strokeWidth="2" fill="none"><ellipse rx="18" ry="7" cx="20" cy="20" transform="rotate(60 20 20)" /><ellipse rx="18" ry="7" cx="20" cy="20" transform="rotate(120 20 20)" /><ellipse rx="18" ry="7" cx="20" cy="20" /></g></svg>
          </span>
        );
      case "nextjs":
        return (
          <span title="Next.js" key="nextjs">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none" className="inline align-middle mr-1">
              <rect width="32" height="32" rx="16" fill="white" />
              <path d="M16 7c-5 0-9 4-9 9s4 9 9 9c2.1 0 4.1-.7 5.7-2l-1.1-1.1c-1.3 1-2.9 1.6-4.6 1.6-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8c0 1.7-.6 3.3-1.6 4.6l1.1 1.1c1.3-1.6 2-3.6 2-5.7 0-5-4-9-9-9zm2.5 4.5l-6 6 1.4 1.4 6-6-1.4-1.4z" fill="#000" />
            </svg>
          </span>
        );
      case "tailwind":
        return (
          <span title="Tailwind CSS" key="tailwind">
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none" className="inline align-middle mr-1"><path d="M24 18c-4 0-6.7 2-8 6 1.3-2 3.3-3 6-3 2.1 0 3.7 1.1 4.8 3.2C28.7 27.1 30.3 28 32 28c4 0 6.7-2 8-6-1.3 2-3.3 3-6 3-2.1 0-3.7-1.1-4.8-3.2C27.3 20.9 25.7 20 24 20z" fill="#38BDF8" /><path d="M16 30c-4 0-6.7 2-8 6 1.3-2 3.3-3 6-3 2.1 0 3.7 1.1 4.8 3.2C20.7 39.1 22.3 40 24 40c4 0 6.7-2 8-6-1.3 2-3.3 3-6 3-2.1 0-3.7-1.1-4.8-3.2C19.3 31.9 17.7 31 16 31z" fill="#38BDF8" /></svg>
          </span>
        );
      case "copilot":
        return (
          <span title="GitHub Copilot" key="copilot">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="none" className="inline align-middle mr-1">
              <rect width="256" height="256" rx="64" fill="#22272B" />
              <g>
                <ellipse cx="85" cy="110" rx="21" ry="22" fill="#A5D6FF" />
                <ellipse cx="171" cy="110" rx="21" ry="22" fill="#A5D6FF" />
                <ellipse cx="128" cy="160" rx="60" ry="32" fill="#A5D6FF" fillOpacity="0.5" />
                <ellipse cx="128" cy="128" rx="88" ry="80" fill="#A5D6FF" fillOpacity="0.15" />
                <ellipse cx="128" cy="128" rx="104" ry="96" fill="#A5D6FF" fillOpacity="0.07" />
              </g>
              <circle cx="85" cy="110" r="10" fill="#22272B" />
              <circle cx="171" cy="110" r="10" fill="#22272B" />
            </svg>
          </span>
        );
      case "codex":
        return (
          <span title="OpenAI Codex" key="codex">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none" className="inline align-middle mr-1">
              <g>
                <path d="M20 3.5a16.5 16.5 0 1 1 0 33 16.5 16.5 0 0 1 0-33zm0 3A13.5 13.5 0 1 0 20 33.5 13.5 13.5 0 0 0 20 6.5z" fill="#10A37F" />
                <path d="M20 10v10l7 7" stroke="#10A37F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          </span>
        );
      case "chatgpt":
        return (
          <span title="ChatGPT" key="chatgpt">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none" className="inline align-middle mr-1">
              <g>
                <path fill="#10A37F" d="M20 3.5a16.5 16.5 0 1 1 0 33 16.5 16.5 0 0 1 0-33zm0 3A13.5 13.5 0 1 0 20 33.5 13.5 13.5 0 0 0 20 6.5z" />
                <path fill="#fff" d="M28.7 17.7c.2-.6.3-1.2.3-1.8 0-3.2-2.6-5.8-5.8-5.8-1.2 0-2.3.4-3.2 1.1-.9-.7-2-1.1-3.2-1.1-3.2 0-5.8 2.6-5.8 5.8 0 .6.1 1.2.3 1.8-2.1.7-3.5 2.7-3.5 5 0 2.8 2.2 5 5 5h12c2.8 0 5-2.2 5-5 0-2.3-1.4-4.3-3.5-5z" />
              </g>
            </svg>
          </span>
        );
      default:
        return null;
    }
  });
}
