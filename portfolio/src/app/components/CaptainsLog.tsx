// app/components/CaptainsLog.tsx
import React from 'react';

type LogEntry = {
    message: string;
    url: string;
    date: string;
    author: string;
};

export function CaptainsLog({ entries }: { entries: LogEntry[] }) {
    return (
        <aside className="w-full sm:max-w-xs bg-neutral-900 border-l border-neutral-800 px-4 py-6 overflow-y-auto text-sm">
            <h2 className="text-white font-semibold mb-4">📡 Captain’s Log</h2>
            <ul className="space-y-4">
                {entries.map((entry, idx) => (
                    <li key={idx} className="text-neutral-400">
                        <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white block"
                        >
                            <p className="font-medium text-white mb-1">{entry.message}</p>
                            <p className="text-xs">{new Date(entry.date).toLocaleString()} – {entry.author}</p>
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
