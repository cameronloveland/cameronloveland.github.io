import React from "react";
import { Repo, dummyRepos } from "../lib/dummyRepos";
import RepoCard from "./RepoCard";

type ProjectsProps = {
    repos?: Repo[];
};

export function Projects({ repos }: ProjectsProps) {
    // Use dummyRepos if no repos prop is provided
    const displayRepos = repos && repos.length > 0 ? repos : dummyRepos;
    // const displayRepos = dummyRepos;

    return (
        <aside className="w-full max-w-2xl bg-neutral-900/60 backdrop-blur-none text-white rounded-xl border border-neutral-800 shadow-lg overflow-hidden mb-12">
            <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-800 bg-neutral-950 text-sm font-semibold uppercase text-neutral-400">
                <span>Featured Projects</span>
                <span className="text-xs font-normal text-neutral-500">
                    {displayRepos.length} total
                </span>
            </div>
            {/* Projects list */}
            <ul className="divide-y divide-neutral-800">
                {displayRepos.slice(0, 6).map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                ))}
            </ul>
        </aside>
    );
}