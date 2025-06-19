// app/components/CaptainsLogSidebar.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LogEntryItem from './LogEntryItem';
import { useGithubLogs } from '../hooks/useGithubLogs';

export function CaptainsLogSidebar() {
    const { logType, entries, progress, next, prev } = useGithubLogs();

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
                    {entries.map((entry, i) => (
                        <LogEntryItem key={entry.message + i} entry={entry} index={i} type={logType} />
                    ))}
                </AnimatePresence>



            </ul>
        </aside>
    );
}
