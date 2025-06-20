'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBranches, getOpenPRs, getRecentCommits } from '../../lib/github';

export type LogType = 'commits' | 'branches' | 'pulls';

export type LogEntry = {
    message: string;
    url?: string;
    date: string;
    author?: string;
};

const logOrder: LogType[] = ['commits', 'branches', 'pulls'];

export default function CaptainsLogSidebar() {
    const [index, setIndex] = useState(0);
    const [logType, setLogType] = useState<LogType>(logOrder[0]);
    const [commits, setCommits] = useState<LogEntry[]>([]);
    const [branches, setBrances] = useState<LogEntry[]>([]);
    const [pulls, setPulls] = useState<LogEntry[]>([]);
    const [progress, setProgress] = useState(0);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        async function fetchCommits() {
            try {
                const recentCommits = await getRecentCommits();
                setCommits(recentCommits);
                const recentBranches = await getBranches();
                setBrances(recentBranches);
                const recentPulls = await getOpenPRs();
                setPulls(recentPulls);
            } catch (err) {
                console.error('GitHub fetch failed:', err);
            }
        }
        fetchCommits();
    }, []);

    useEffect(() => {
        setLogType(logOrder[index]);
    }, [index]);

    useEffect(() => {
        setProgress(0); // reset progress when logType changes
    }, [logType]);


    useEffect(() => {
        let startTime: number | null = null;
        const duration = 20000; // 10 seconds total for full progress (adjust if needed)

        const animate = (timestamp: number) => {
            if (startTime === null) startTime = timestamp;
            const elapsed = timestamp - startTime;

            const newProgress = Math.min((elapsed / duration) * 100, 100);
            setProgress(newProgress);

            if (elapsed < duration) {
                requestAnimationFrame(animate);
            } else {
                // When done, reset for next type
                setIndex((prevIndex) => (prevIndex + 1) % logOrder.length);
                setProgress(0);
                startTime = null;
                requestAnimationFrame(animate); // Restart
            }
        };

        const raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, []);

    const entries: LogEntry[] = {
        commits,
        branches,
        pulls,
    }[logType];

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;

        const maxScroll = el.scrollHeight - el.clientHeight;
        const targetScrollTop = (progress / 100) * maxScroll;
        el.scrollTop = targetScrollTop;
    }, [progress, entries]);
    ;


    const next = () => {
        setIndex((prev) => (prev + 1) % logOrder.length);
        setProgress(0);
    };
    const prev = () => {
        setIndex((prev) => (prev - 1 + logOrder.length) % logOrder.length);
        setProgress(0);
    };

    return (
        <aside className="w-full max-w-2xl bg-neutral-900/60 backdrop-blur-none text-white rounded-xl border border-neutral-800 shadow-lg overflow-hidden mb-12 flex flex-col h-[35vh]">
            <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-800 bg-neutral-950 text-sm font-semibold uppercase text-neutral-400 overflow-hidden">
                <span>Captain&apos;s Log – {logType}</span>
                <div className="flex gap-2">
                    <button onClick={prev} className="hover:text-white">←</button>
                    <button onClick={next} className="hover:text-white">→</button>
                </div>
            </div>
            <div className="h-[1px] w-full">
                <motion.div
                    className={`h-full ${{
                        commits: 'bg-sky-500',
                        branches: 'bg-green-500',
                        pulls: 'bg-purple-500',
                    }[logType] ?? 'bg-blue-500'
                        }`}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'easeInOut', duration: 0.2 }}
                />
            </div>
            <ul
                ref={listRef}
                className="divide-y divide-neutral-800 flex flex-col flex-1 overflow-y-auto overflow-x-hidden scrollbar-hidden"
            >
                <AnimatePresence initial={false}>
                    {entries.map((entry, i) => {
                        const levelClass = {
                            commits: 'bg-sky-900 text-sky-300',
                            branches: 'bg-green-900 text-green-300',
                            pulls: 'bg-purple-900 text-purple-300',
                        }[logType] || 'bg-neutral-800 text-neutral-400';

                        return (
                            <motion.li
                                key={entry.message + i + logType}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ delay: i * 0.05 }}
                                className="group hover:bg-white/5 transition-colors duration-300 rounded-md px-4 py-2 text-sm flex flex-col gap-1"
                            >
                                <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
                                    <span className={`px-2 py-1 rounded uppercase font-bold ${levelClass}`}>
                                        {logType}
                                    </span>
                                    <span className="text-neutral-300 break-words whitespace-normal">
                                        {entry.message}
                                        <span className="ml-2 text-neutral-500 italic">
                                            — {entry.author || 'Unknown'} @ {new Date(entry.date).toLocaleDateString()}
                                        </span>
                                    </span>
                                </div>

                                {entry.url && (
                                    <div className="flex justify-end">
                                        <a
                                            href={entry.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`text-xs font-semibold px-3 py-1 rounded-md shadow-md transition-all duration-300
    ${{
                                                    commits: 'bg-sky-600 text-white hover:bg-sky-500',
                                                    branches: 'bg-green-600 text-white hover:bg-green-500',
                                                    pulls: 'bg-purple-600 text-white hover:bg-purple-500',
                                                }[logType] || 'bg-neutral-600 text-white hover:bg-neutral-500'
                                                }
    opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0
  `}
                                        >
                                            View →
                                        </a>

                                    </div>
                                )}
                            </motion.li>
                        );
                    })}
                </AnimatePresence>
            </ul>
        </aside>
    );
}
