'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOpenPRs, getRecentCommits } from '../../lib/github';

export type LogType = 'commits' | 'pulls';

export type LogEntry = {
    message: string;
    url?: string;
    date: string;
    author?: string;
};

const logOrder: LogType[] = ['commits', 'pulls'];

export default function CaptainsLogSidebar() {
    const [index, setIndex] = useState(0);
    const [logType, setLogType] = useState<LogType>(logOrder[0]);
    const [commits, setCommits] = useState<LogEntry[]>([]);
    const [pulls, setPulls] = useState<LogEntry[]>([]);
    const [progress, setProgress] = useState(0);
    const [paused, setPaused] = useState(false);
    const [userInteracting, setUserInteracting] = useState(false);
    const scrollRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        async function fetchCommits() {
            try {
                const recentCommits = await getRecentCommits();
                setCommits(recentCommits);
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
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [index]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        let frameId: number;
        let lastTime: number | null = null;
        const speed = 0.15;

        const scrollStep = (timestamp: number) => {
            if (lastTime === null) lastTime = timestamp;
            const delta = timestamp - lastTime;

            if (!paused && !userInteracting && el.scrollHeight > el.clientHeight) {
                el.scrollTop += delta * speed;

                if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
                    el.scrollTop = 0;
                }
            }

            lastTime = timestamp;
            frameId = requestAnimationFrame(scrollStep);
        };

        frameId = requestAnimationFrame(scrollStep);

        return () => cancelAnimationFrame(frameId);
    }, [paused, userInteracting, logType]);

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

    useEffect(() => {
        let frameId: number;
        let startTime: number | null = null;
        const duration = 15000;
        let lastUpdateTime = 0;
        const throttleMs = 100;

        const animate = (timestamp: number) => {
            if (startTime === null) startTime = timestamp;
            const elapsed = timestamp - startTime;

            if (timestamp - lastUpdateTime >= throttleMs) {
                const newProgress = Math.min((elapsed / duration) * 100, 100);
                setProgress(newProgress);
                lastUpdateTime = timestamp;
            }

            if (elapsed < duration) {
                frameId = requestAnimationFrame(animate);
            } else {
                setIndex((prevIndex) => (prevIndex + 1) % logOrder.length);
            }
        };

        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [logType]);

    const entries: LogEntry[] = {
        commits,
        pulls,
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
        <div className="hud-panel">
            <aside className="hud-aside-container">
                <div className="flex justify-between items-center px-4 py-2 bg-[#0c0f1c]/80 border-b border-cyan-400/10 text-cyan-300 text-sm font-semibold uppercase overflow-hidden">
                    <span>
                        Recent – {logType === "pulls" ? "Pull Requests" : logType.charAt(0).toUpperCase() + logType.slice(1)}
                    </span>
                    <div className="flex gap-2">
                        <button onClick={prev} className="hover:text-white hover-sound cursor-pointer">←</button>
                        <button onClick={next} className="hover:text-white hover-sound cursor-pointer">→</button>
                    </div>
                </div>
                <div className="h-[1px] w-full">
                    <motion.div
                        className="h-full bg-cyan-400"
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: 'linear', duration: 0.1 }}
                    />
                </div>
                <div className="relative h-[calc(25vh-3rem)]">
                    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400/30 h-full">
                        <ul ref={scrollRef} className="space-y-2 pr-2">

                            <AnimatePresence initial={false}>
                                {entries.map((entry, i) => {
                                    const levelClass = 'bg-cyan-800 text-cyan-300';
                                    return (
                                        <motion.li
                                            key={entry.message + i + logType}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="relative group hover:bg-white/5 transition-colors duration-300 rounded-md px-4 py-2 text-sm flex flex-col gap-1"
                                        >
                                            <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
                                                <span className="text-cyan-400/80 font-mono text-xs mr-2">
                                                    #{String(i + 1).padStart(3, '0')}
                                                </span>
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
                                                <div className="absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <a
                                                        href={entry.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs font-semibold px-3 py-1 rounded-md shadow-md bg-cyan-600 text-white hover:bg-cyan-400"
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
                    </div>
                </div>
            </aside>
        </div>
    );
}
