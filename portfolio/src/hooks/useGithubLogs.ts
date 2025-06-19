import { useEffect, useState } from 'react';
import { getBranches, getOpenPRs, getRecentCommits } from '../lib/github';

export type LogType = 'commits' | 'branches' | 'pulls';
export type LogEntry = {
  message: string;
  url?: string;
  date: string;
  author?: string;
};

const logOrder: LogType[] = ['commits', 'branches', 'pulls'];

export function useGithubLogs() {
  const [index, setIndex] = useState(0);
  const [commits, setCommits] = useState<LogEntry[]>([]);
  const [branches, setBranches] = useState<LogEntry[]>([]);
  const [pulls, setPulls] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function fetchAll() {
      const [c, b, p] = await Promise.all([
        getRecentCommits(),
        getBranches(),
        getOpenPRs(),
      ]);
      setCommits(c);
      setBranches(b);
      setPulls(p);
    }
    fetchAll();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIndex((i) => (i + 1) % logOrder.length);
          return 0;
        }
        return prev + 1;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const logType = logOrder[index];
  const entries: LogEntry[] = { commits, branches, pulls }[index];

  const next = () => {
    setIndex((i) => (i + 1) % logOrder.length);
    setProgress(0);
  };
  const prev = () => {
    setIndex((i) => (i - 1 + logOrder.length) % logOrder.length);
    setProgress(0);
  };

  return { logType, entries, progress, next, prev };
}
