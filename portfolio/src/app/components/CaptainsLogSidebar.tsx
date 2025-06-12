"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fakeCommits = [
    { type: "commit", text: "feat: added new hero banner", date: "2024-06-10" },
    { type: "commit", text: "fix: corrected layout bug on mobile", date: "2024-06-09" },
    { type: "commit", text: "chore: updated dependencies", date: "2024-06-08" },
];

const manualUpdates = [
    { type: "update", text: "Deployed new portfolio layout", date: "2024-06-10" },
    { type: "update", text: "Polished project card animations", date: "2024-06-09" },
    { type: "update", text: "Integrated GitHub API for repo data", date: "2024-06-08" },
];

const alerts = [
    { type: "alert", text: "[CI] Warning: Build took 2x longer than expected", date: "2024-06-09" },
    { type: "alert", text: "[GH] Failed push to main (permissions issue)", date: "2024-06-08" },
];

type LogType = "commits" | "updates" | "alerts";

const logsByType: Record<LogType, { type: string; text: string; date: string }[]> = {
    commits: fakeCommits,
    updates: manualUpdates,
    alerts: alerts,
};

const logOrder: LogType[] = ["updates", "commits", "alerts"];

export default function CaptainsLog() {
    const [index, setIndex] = useState(0);
    const [logType, setLogType] = useState<LogType>(logOrder[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % logOrder.length);
        }, 10000); // Rotate every 10s

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setLogType(logOrder[index]);
    }, [index]);

    const entries = logsByType[logType];

    return (
        <aside className="fixed top-28 right-4 w-80 bg-neutral-900 text-white rounded-xl border border-neutral-800 shadow-lg overflow-hidden">
            <div className="px-4 py-2 border-b border-neutral-800 bg-neutral-950 text-sm font-semibold uppercase text-neutral-400">
                Captain's Log – {logType}
            </div>
            <ul className="divide-y divide-neutral-800">
                <AnimatePresence mode="wait">
                    {entries.map((entry, i) => (
                        <motion.li
                            key={entry.text}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ delay: i * 0.1 }}
                            className="px-4 py-3 text-sm text-neutral-300"
                        >
                            <span className="font-mono text-xs text-neutral-500 block mb-1">{entry.date}</span>
                            <span className="inline-block bg-neutral-800 px-2 py-1 rounded text-xs font-bold uppercase mr-2 text-neutral-400">
                                {entry.type}
                            </span>
                            {entry.text}
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </aside>
    );
}
