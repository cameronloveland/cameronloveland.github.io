import React from "react";

const missionLogs = [
    { date: "2024-06-01", message: "🛰️ Portfolio deployed via GitHub Actions" },
    { date: "2024-06-03", message: "🛠️ Starboard nav refactored – FontAwesome live" },
    { date: "2024-06-05", message: "🧪 README auto-summary via GitHub API integrated" },
    { date: "2024-06-10", message: "🎨 Cockpit UI aligned to starship theme" },
];

export default function CaptainsLogSidebar() {
    return (
        <aside className="fixed right-0 top-24 w-64 max-h-[80vh] overflow-y-auto px-4 py-6 bg-neutral-900 border-l border-neutral-800 text-neutral-300 text-sm shadow-lg backdrop-blur-md z-10">
            <h2 className="text-white font-semibold text-lg mb-4 border-b border-neutral-700 pb-2">
                Captain's Log
            </h2>
            <ul className="space-y-3 animate-scroll-log">
                {missionLogs.map((log, index) => (
                    <li key={index} className="opacity-90 hover:opacity-100 transition">
                        <div className="text-xs text-neutral-500">{log.date}</div>
                        <div>{log.message}</div>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
