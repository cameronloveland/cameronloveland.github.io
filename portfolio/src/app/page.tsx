// page.tsx
import React from 'react';
import MinimalTemplate from './MinimalTemplate';
import { Repo } from './Repo';

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
    <MinimalTemplate title="My GitHub Repos">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.slice(0, 6).map((repo: Repo) => (
          <div
            key={repo.id}
            className="border p-4 rounded hover:shadow transition"
          >
            <h2 className="text-lg font-medium">{repo.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {repo.description}
            </p>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on GitHub
            </a>
          </div>
        ))}
      </div>
    </MinimalTemplate>
  );
}
