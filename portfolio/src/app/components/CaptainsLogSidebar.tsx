// app/components/CaptainsLogSidebar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRecentCommits } from '../lib/github';

export type LogType = 'commits' | 'updates' | 'alerts';

export type LogEntry = {
    message: string;
    url?: string;
    date: string;
    author?: string;
};

const dummyUpdates: LogEntry[] = [
    { message: 'Created portfolio scaffold using Next.js + Tailwind', date: '2024-06-03', author: 'Cameron' },
    { message: 'Integrated GitHub API for dynamic repo data', date: '2024-06-04', author: 'Cameron' },
    { message: 'Redesigned layout with framer-motion animations', date: '2024-06-05', author: 'Cameron' },
    { message: "Switched from blog section to Captain's Log concept", date: '2024-06-07', author: 'Cameron' },
    { message: 'Added commit rotation and log type toggling', date: '2024-06-08', author: 'Cameron' },
];

const dummyAlerts: LogEntry[] = [
    { message: 'Detected detached HEAD during local dev', date: '2024-06-04', author: 'Git Helper' },
    { message: 'GitHub Pages build failed due to incorrect `out` path', date: '2024-06-05', author: 'CI/CD Monitor' },
    { message: 'npm install failed due to package scope typo', date: '2024-06-05', author: 'BuildBot' },
    { message: 'Duplicate deploy copy step found in workflow YAML', date: '2024-06-06', author: 'CI Linter' },
    { message: 'Mismatch between project basePath and GitHub Pages config', date: '2024-06-07', author: 'ConfigChecker' },
];

const logOrder: LogType[] = ['updates', 'commits', 'alerts'];

export function CaptainsLogSidebar() {
    const [index, setIndex] = useState(0);
    const [logType, setLogType] = useState<LogType>(logOrder[0]);
    const [commits, setCommits] = useState<LogEntry[]>([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        async function fetchCommits() {
            const data = await getRecentCommits();
            setCommits(data);
        }
        fetchCommits();
    }, []);

    useEffect(() => {
        setLogType(logOrder[index]);
    }, [index]);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    setIndex((prevIndex) => (prevIndex + 1) % logOrder.length);
                    return 0;
                }
                return prev + 1;
            });
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const entries: LogEntry[] = {
        commits,
        updates: dummyUpdates,
        alerts: dummyAlerts,
    }[logType];

    const next = () => {
        setIndex((prev) => (prev + 1) % logOrder.length);
        setProgress(0);
    };
    const prev = () => {
        setIndex((prev) => (prev - 1 + logOrder.length) % logOrder.length);
        setProgress(0);
    };

    return (
        <aside className="w-full max-w-2xl bg-neutral-900/60 backdrop-blur-none text-white rounded-xl border border-neutral-800 shadow-lg overflow-hidden mb-12">
            <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-800 bg-neutral-950 text-sm font-semibold uppercase text-neutral-400">
                <span>Captain&apos;s Log – {logType}</span>
                <div className="flex gap-2">
                    <button onClick={prev} className="hover:text-white">←</button>
                    <button onClick={next} className="hover:text-white">→</button>
                </div>
            </div>
            <div className="h-[1px] w-full bg-neutral-800">
                <motion.div
                    className="bg-blue-500 h-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'easeInOut', duration: 0.2 }} // smoother, matches 200ms interval
                />
            </div>
            <ul className="divide-y divide-neutral-800 max-h-[500px] overflow-y-hidden" >
                <AnimatePresence initial={false}>
                    {entries.map((entry, i) => {
                        const logLevel = logType.toLowerCase();
                        const logClassMap: Record<string, string> = {
                            commit: 'bg-sky-900 text-sky-300',
                            alert: 'bg-red-900 text-red-400',
                            update: 'bg-amber-900 text-amber-300',
                            telemetry: 'bg-teal-900 text-teal-300',
                        };
                        const levelClass = logClassMap[logLevel] || 'bg-neutral-800 text-neutral-400';

                        return (
                            <motion.li
                                key={entry.message + i + logType}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-neutral-900 hover:bg-white/5 transition-colors duration-300 rounded-md px-4 py-2 text-sm flex justify-between items-center"
                            >
                                {/* Left side */}
                                <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
                                    <span className={`px-2 py-1 rounded uppercase font-bold ${levelClass}`}>
                                        {logType}
                                    </span>
                                    <span className="text-neutral-300">
                                        {entry.message}
                                        <span className="ml-2 text-neutral-500 italic">
                                            — {entry.author || 'Unknown'} @ {new Date(entry.date).toLocaleDateString()}
                                        </span>
                                    </span>
                                </div>

                                {/* Right side: fade in GitHub link */}
                                {entry.url && (
                                    <a
                                        href={entry.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-neutral-500 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                                    >
                                        View →
                                    </a>
                                )}
                            </motion.li>
                        );
                    })}
                </AnimatePresence>



            </ul>
        </aside>
    );
}
