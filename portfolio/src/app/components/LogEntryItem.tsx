import React from 'react';
import { motion } from 'framer-motion';
import { LogEntry, LogType } from '../hooks/useGithubLogs';

export default function LogEntryItem({ entry, index, type }: { entry: LogEntry; index: number; type: LogType; }) {
  const logLevel = type.toLowerCase();
  const logClassMap: Record<string, string> = {
    commit: 'bg-sky-900 text-sky-300',
    alert: 'bg-red-900 text-red-400',
    update: 'bg-amber-900 text-amber-300',
    telemetry: 'bg-teal-900 text-teal-300',
  };
  const levelClass = logClassMap[logLevel] || 'bg-neutral-800 text-neutral-400';
  return (
    <motion.li
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-neutral-900 hover:bg-white/5 transition-colors duration-300 rounded-md px-4 py-2 text-sm flex justify-between items-center"
    >
      <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
        <span className={`px-2 py-1 rounded uppercase font-bold ${levelClass}`}>{type}</span>
        <span className="text-neutral-300">
          {entry.message}
          <span className="ml-2 text-neutral-500 italic">
            — {entry.author || 'Unknown'} @ {new Date(entry.date).toLocaleDateString()}
          </span>
        </span>
      </div>
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
}
