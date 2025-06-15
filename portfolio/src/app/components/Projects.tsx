import React from "react";
import { Repo } from "../Repo";
import { getTopicIcon } from "../lib/getTopicIcon";

type ProjectsProps = {
    repos: Repo[];
};

export function Projects({ repos }: ProjectsProps) {
    return (
        <aside className="w-full max-w-2xl bg-neutral-900/80 text-white rounded-xl border border-neutral-800 shadow-lg overflow-hidden mb-12">
            {/* Header bar */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-800 bg-neutral-950/80 text-base font-bold uppercase text-neutral-200">
                <span>Featured Projects</span>
                <span className="text-xs font-normal text-neutral-500">
                    {repos.length} total
                </span>
            </div>
            {/* Projects list */}
            <ul className="divide-y divide-neutral-800">
                {repos.slice(0, 6).map((repo) => (
                    <li key={repo.id} className="px-4 py-4 text-sm text-neutral-300">
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
                                {(repo.topics?.length ?? 0) > 0 && (
                                    <div className="flex flex-wrap gap-1 ml-2">
                                        {repo.topics?.map((topic) => (
                                            <span
                                                key={topic}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border border-neutral-700 bg-neutral-800 text-white"
                                            >
                                                {getTopicIcon(topic)}
                                                <span>{topic}</span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="text-neutral-400 text-xs mt-1">
                                {repo.readmeSummary || (
                                    <span className="italic text-neutral-600">No description</span>
                                )}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
}