'use client';

import React, { useState, useRef, useEffect } from "react";

const COMMON_COMMANDS = [
    // Windows
    "dir", "cls", "copy", "del", "move", "type", "cd", "md", "rd", "ren", "attrib", "echo", "pause", "exit", "start", "tasklist", "taskkill", "ipconfig", "ping", "netstat", "chkdsk", "format", "shutdown",
    // Bash/Linux
    "ls", "pwd", "cd", "cat", "cp", "mv", "rm", "touch", "mkdir", "rmdir", "echo", "clear", "exit", "sudo", "chmod", "chown", "ps", "kill", "top", "man", "grep", "find", "df", "du", "ifconfig", "ping", "uname", "history"
];

const Terminal: React.FC = () => {
    const [showYesNo, setShowYesNo] = useState(false);
    const [log, setLog] = useState<string[]>([
        "Welcome, crew member...",
        "For a list of available commands, type 'help'."
    ]);
    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [log]);
    const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
    const [awaitingResponse, setAwaitingResponse] = useState(false);
    const [input, setInput] = useState("");
    const [commandCount, setCommandCount] = useState(0);
    const logEndRef = useRef<HTMLDivElement | null>(null);

    const isCommonCommand = (input: string) => {
        const cleaned = input.trim().toLowerCase();
        return COMMON_COMMANDS.some(cmd =>
            cleaned === cmd ||
            cleaned.startsWith(cmd + " ") // e.g. "ls -la"
        );
    };

    const respondToInput = (input: string): string[] => {
        const cleaned = input.trim().toLowerCase();

        if (isCommonCommand(cleaned)) {
            return ["Lol, this ain't your dads's terminal pal."];
        }

        if (cleaned.includes("status")) {
            return [
                "Ship status: marginally operational.",
                "Hull integrity: 67%.",
                "Crew morale: ...ambiguous.",
            ];
        }

        if (cleaned.includes("engine")) {
            return [
                "Engine diagnostics online.",
                "Core temperature: 872°C. That’s either great or terrible.",
                "Thrust vector stable(ish).",
            ];
        }

        if (cleaned === "reset") {
            setCommandCount(0);
            return ["System reset. Command counter back to zero."];
        }

        if (cleaned.includes("help")) {
            return [
                "Available commands: help, status, engine, diagnostics, override, whoami, reset."
            ];
        }

        if (cleaned.includes("whoami")) {
            return [
                "Analyzing genetic imprint...",
                "Cross-referencing with coffee order history...",
                "Confirmed: you’re the Captain. Sort of.",
            ];
        }

        if (cleaned.includes("override")) {
            return [
                "Override code required.",
                "Just kidding. You’re locked out. ☺",
            ];
        }

        return [
            "Command received. Processing...",
            "No clue what that means. But I'll act like it was important.",
        ];
    };

    const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter" || input.trim() === "") return;

        const newInput = input.trim();
        const cleaned = newInput.toLowerCase();
        setLog((prev) => [...prev, `> ${newInput}`]);
        setInput("");

        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

        if (awaitingResponse) {
            setLog((prev) => [...prev, "..."]);
            setAwaitingResponse(false);
            setTimeout(() => {
                setLog((prev) => [...prev, "System offline. 🙄"]);
            }, 1000);
            return;
        }

        // Restart inactivity timer
        inactivityTimer.current = setTimeout(() => {
            setLog((prev) => [
                ...prev,
                "Are you still there?",
                "For assistance, type 'help'."
            ]);
            setAwaitingResponse(true);
        }, 20000);

        // HELP command short-circuits progression logic
        if (cleaned === "help") {
            const responses = respondToInput(cleaned);
            setLog((prev) => [...prev, ...responses]);
            return;
        }

        const currentCount = commandCount + 1;
        setCommandCount(currentCount);

        setTimeout(() => {
            if (currentCount === 1) {
                setLog((prev) => [...prev, "Wait... is there still a guy floating outside the ship?"]);
                setShowYesNo(true);
            } else if (currentCount === 2) {
                setLog((prev) => [...prev, "Hmm. That's weird. I thought we fixed that."]);
            } else {
                const responses = respondToInput(newInput);
                setLog((prev) => [...prev, ...responses]);
            }
        }, 500);
    };

    return (
        <div className="hud-aside-container bg-black text-blue-400 font-mono text-sm flex flex-col h-full">
            {/* Header */}
            <div className="sticky top-0 z-10 flex justify-between items-center px-4 py-2 border-b border-neutral-800 bg-neutral-950 text-sm font-semibold uppercase text-neutral-400">
                <span>Terminal</span>
            </div>
            {/* Body */}
            <div className="p-4 space-y-1 max-h-64 overflow-y-auto relative scrollbar-hidden">
                {log.map((line, idx) => (
                    <div key={idx}>
                        {line.startsWith("Available commands:") ? (
                            <>
                                Available commands:{' '}
                                {line
                                    .replace("Available commands:", "")
                                    .split(',')
                                    .map((cmd, i, arr) => (
                                        <span key={i} className="text-blue-400">
                                            {cmd.trim()}{i < arr.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                            </>
                        ) : (
                            line
                        )}
                    </div>
                ))}
                <div className="flex items-center">
                    <span className="mr-2">&gt;</span>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleInput}
                        className="bg-transparent outline-none flex-1 text-blue-400 placeholder-blue-500"
                        placeholder="Type a command..."
                        autoFocus
                    />
                </div>
                <div ref={logEndRef} />
                {showYesNo && (
                    <div className="flex gap-4 mt-2">
                        <button
                            onClick={() => {
                                setLog((prev) => [...prev, "> yes", "...Why did it take you so long to bring it up?"]);
                                setShowYesNo(false);
                            }}
                            className="bg-blue-500 text-black px-3 py-1 rounded hover:bg-blue-400"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => {
                                setLog((prev) => [...prev, "> no", "...Why did it take you so long to bring it up?"]);
                                setShowYesNo(false);
                            }}
                            className="bg-blue-500 text-black px-3 py-1 rounded hover:bg-blue-400"
                        >
                            No
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Terminal;
