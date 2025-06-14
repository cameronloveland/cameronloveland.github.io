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
        <aside className="fixed top-28 right-4 w-80 bg-neutral-900 text-white rounded-xl border border-neutral-800 shadow-lg overflow-hidden z-30">
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
                    {entries.map((entry, i) => (
                        <motion.li
                            key={entry.message + i + logType}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ delay: i * 0.05 }}
                            className="px-4 py-3 text-sm text-neutral-300"
                        >
                            <span className="font-mono text-xs text-neutral-500 block mb-1">
                                {new Date(entry.date).toLocaleDateString()} – {entry.author || 'Unknown'}
                            </span>
                            <span className="inline-block bg-neutral-800 px-2 py-1 rounded text-xs font-bold uppercase mr-2 text-neutral-400">
                                {entry.url ? <a href={entry.url} target="_blank" rel="noopener noreferrer">{logType}</a> : logType}
                            </span>
                            {entry.message}
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </aside>
    );
}
