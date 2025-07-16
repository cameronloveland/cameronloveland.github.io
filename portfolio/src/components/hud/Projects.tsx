'use client';

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "../Icons";

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
    const scrollRef = useRef<HTMLUListElement>(null);
    const [paused, setPaused] = useState(false);
    const [userInteracting, setUserInteracting] = useState(false);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        let frameId: number;
        let lastTime: number | null = null;
        const speed = 0.15;

        const step = (timestamp: number) => {
            if (lastTime === null) lastTime = timestamp;
            const delta = timestamp - lastTime;

            if (!paused && !userInteracting && el.scrollHeight > el.clientHeight) {
                el.scrollTop += delta * speed;

                if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
                    el.scrollTop = 0;
                }
            }

            lastTime = timestamp;
            frameId = requestAnimationFrame(step);
        };

        frameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frameId);
    }, [paused, userInteracting, displayRepos]);

    const handleMouseEnter = () => {
        setPaused(true);
        setUserInteracting(true);
    };
    const handleMouseLeave = () => {
        setPaused(false);
        setUserInteracting(false);
    };
    const handleScroll = () => {
        setUserInteracting(true);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
        el.addEventListener('scroll', handleScroll);

        return () => {
            el.removeEventListener('mouseenter', handleMouseEnter);
            el.removeEventListener('mouseleave', handleMouseLeave);
            el.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="hud-panel">
            <aside className="hud-aside-container">
                <div className="flex justify-between items-center px-4 pt-1 pb-2 border-b border-cyan-400/10 text-cyan-300 text-sm font-semibold uppercase">
                    <span>Featured Projects</span>
                    <span className="text-xs font-normal text-neutral-500">
                        {displayRepos.length} total
                    </span>
                </div>
                {/* Projects list */}
                <div className="relative h-[calc(25vh-3rem)]">
                    <div className="hud-scroll h-full overflow-y-auto">
                        <ul ref={scrollRef} className="space-y-2 pr-2">
                            {displayRepos.slice(0, 6).map((repo) => (
                                <li key={repo.id} className="px-4 py-4 text-sm text-neutral-300">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="link-style"

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
                                                        <Icon topic={topic} />
                                                        <span>{topic}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </aside >
        </div >
    );
}