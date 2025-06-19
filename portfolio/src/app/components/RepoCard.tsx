import React from 'react';
import { Repo } from '../lib/dummyRepos';
import TopicBadge from './TopicBadge';

export default function RepoCard({ repo }: { repo: Repo }) {
  return (
    <li className="px-4 py-4 text-sm text-neutral-300">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-base font-semibold text-white hover:text-blue-400 transition"
          >
            {repo.name}
          </a>
        </div>
        <p className="text-neutral-400 text-xs mt-1">
          {repo.readmeSummary || <span className="italic text-neutral-600">No description</span>}
        </p>
        <div className="border-t border-neutral-800 my-2" />
        {repo.topics && (
          <div className="flex flex-wrap gap-1 ml-2">
            {repo.topics.map((t) => (
              <TopicBadge key={t} topic={t} />
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
