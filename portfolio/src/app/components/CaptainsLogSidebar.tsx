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
    {
        message: 'Switched from blog section to Captains Log concept', date: '2024-06-07', author: 'Cameron'
    },
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

    useEffect(() => {
        async function fetchCommits() {
            const data = await getRecentCommits();
            setCommits(data);
        }
        fetchCommits();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % logOrder.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setLogType(logOrder[index]);
    }, [index]);

    const entries: LogEntry[] = {
        commits,
        updates: dummyUpdates,
        alerts: dummyAlerts,
    }[logType];

    return (
        <aside className="fixed top-28 right-4 w-80 bg-neutral-900 text-white rounded-xl border border-neutral-800 shadow-lg overflow-hidden z-30">
            <div className="px-4 py-2 border-b border-neutral-800 bg-neutral-950 text-sm font-semibold uppercase text-neutral-400">
                Captain's Log – {logType}
            </div>
            <ul className="divide-y divide-neutral-800">
                <AnimatePresence mode="wait">
                    {entries.map((entry, i) => (
                        <motion.li
                            key={entry.message + i}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ delay: i * 0.1 }}
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
