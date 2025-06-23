'use client';

import React, { useState, useEffect, useRef } from "react";

const MiddleComponent: React.FC = () => {
    const [input, setInput] = useState("");
    const [log, setLog] = useState<string[]>(["Welcome, crew member.", "Please enter your designation:"]);
    const [commandCount, setCommandCount] = useState(0);

    const [systemOffline, setSystemOffline] = useState(false);
    const logEndRef = useRef<HTMLDivElement | null>(null);

    const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && input.trim() !== "" && !systemOffline) {
            const newInput = input.trim();
            setLog((prev) => [...prev, `> ${newInput}`]);
            setInput("");
            const currentCount = commandCount + 1;
            setCommandCount(currentCount);
            console.log("Command count:", commandCount);
            setTimeout(() => {
                if (currentCount === 1) {
                    setLog((prev) => [...prev, "Are you ready?"]);
                } else if (currentCount === 2) {
                    setLog((prev) => [...prev, "Wait... is there still a guy floating outside the ship?"]);
                } else if (currentCount === 3) {
                    setLog((prev) => [...prev, "..."]);
                    setTimeout(() => {
                        setLog((prev) => [...prev, "Hmm, that's odd. System offline."]);
                        setSystemOffline(true);
                    }, 1000);
                }
            }, 500);
        }
    };

    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [log]);

    return (
        <div className="hud-aside-container bg-black text-blue-400 font-mono text-sm flex flex-col h-full">
            {/* Header */}
            <div className="sticky top-0 z-10 flex justify-between items-center px-4 py-2 border-b border-neutral-800 bg-neutral-950 text-sm font-semibold uppercase text-neutral-400">
                <span>Terminal</span>
            </div>
            {/* Body */}
            <div className="p-4 space-y-1 max-h-64 overflow-y-auto relative scrollbar-hidden">
                {log.map((line, idx) => (
                    <div key={idx}>{line}</div>
                ))}
                {!systemOffline && (
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
                )}
                <div ref={logEndRef} />
            </div>
        </div>
    );
};

export default MiddleComponent;
