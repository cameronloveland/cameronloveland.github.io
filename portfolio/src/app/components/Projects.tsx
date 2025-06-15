import React from "react";
import { Repo } from "../Repo";
import { getTopicIcon } from "../lib/getTopicIcon";

type ProjectsProps = {
    repos: Repo[];
};

export function Projects({ repos }: ProjectsProps) {
    return (
        <section id="projects" className="w-full max-w-2xl mb-16">
            <h2 className="text-xl font-bold text-white mb-4 px-4 pt-4">Featured Projects</h2>
            <div className="flex flex-col gap-4">
                {repos.slice(0, 6).map((repo: Repo) => (
                    <a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-neutral-800 bg-neutral-900/80 shadow px-5 py-4 transition hover:bg-neutral-800/80"
                    >
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition">
                                    {repo.name}
                                </h3>

                            </div>
                            <p className="text-neutral-400 text-sm mt-1">
                                {repo.readmeSummary || <span className="italic text-neutral-600">No description</span>}
                            </p>
                        </div>
                        <div className="flex flex-wrap mt-2">
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
                    </a>


                ))}
            </div>
        </section>
    );
}