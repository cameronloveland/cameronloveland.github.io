// page.tsx
import React from 'react';
import { Repo } from './Repo';
import AnimatedBackground from './AnimatedBackground';

async function getRepos() {
  const response = await fetch('https://api.github.com/users/cameronloveland/repos', {
    headers: { Accept: 'application/vnd.github.v3+json' },
    // cache: 'no-store' // if you want fresh data on each request
  });
  if (!response.ok) throw new Error('Failed to fetch repos');
  return response.json();
}

export default async function Home() {
  const repos = await getRepos();

  return (
    <div className="relative overflow-hidden p-8 bg-black min-h-screen text-white">
      <AnimatedBackground />
      <h1 className="relative z-10 text-4xl font-bold mb-6">My GitHub Repos</h1>
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.slice(0, 6).map((repo: Repo) => (
          <div
            key={repo.id}
            className="backdrop-blur-md bg-white/10 border border-white/20 p-4 rounded-lg shadow hover:scale-105 transform transition"
          >
            <h2 className="text-xl font-semibold">{repo.name}</h2>
            <p className="text-sm text-gray-200">{repo.description}</p>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-300 hover:underline"
            >
              View on GitHub
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
