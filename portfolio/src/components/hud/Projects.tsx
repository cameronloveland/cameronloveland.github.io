"use client";

import React, { useRef } from "react";
import { TopicIcon } from "./TopicIcon";
import { useSlowScroll } from "../../hooks/useSlowScroll";

type Repo = {
    id: number;
    name: string;
    html_url: string;
    readmeSummary?: string;
    topics?: string[];
};

type ProjectsProps = {
    repos?: Repo[];
};

export default function Projects({ repos }: ProjectsProps) {
    const displayRepos = repos ?? [];
    const listRef = useRef<HTMLUListElement>(null);
    useSlowScroll<HTMLUListElement>(listRef);

    return (
        <aside className="hud-aside-container">
            <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-800 bg-neutral-950 text-sm font-semibold uppercase text-neutral-400">
                <span>Featured Projects</span>
                <span className="text-xs font-normal text-neutral-500">
                    {displayRepos.length} total
                </span>
            </div>
            {/* Projects list */}
            <ul ref={listRef} className="divide-y divide-neutral-800 auto-scroll">
                {displayRepos.slice(0, 6).map((repo) => (
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

                            </div>

                            <p className="text-neutral-400 text-xs mt-1">
                                {repo.readmeSummary || (
                                    <span className="italic text-neutral-600">No description</span>
                                )}
                            </p>
                            {/* Subtle divider line between description and topics */}
                            <div className="border-t border-neutral-800 my-2" />
                            {(repo.topics?.length ?? 0) > 0 && (
                                <div className="flex flex-wrap gap-1 ml-2">
                                    {repo.topics?.map((topic) => (
                                        <span
                                            key={topic}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border border-neutral-700 bg-neutral-800 text-white"
                                        >
                                            <TopicIcon topic={topic} />
                                            <span>{topic}</span>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
}