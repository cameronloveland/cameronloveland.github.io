'use client';

import { useEffect, useState } from 'react';
import { getCommitContributionStats } from '../../lib/github';

export default function CommitTelemetry() {
  const [you, setYou] = useState(0);
  const [codex, setCodex] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getCommitContributionStats();
        setYou(data.you);
        setCodex(data.codex);
      } catch (err) {
        console.error('Failed to load commit stats', err);
      }
    }
    fetchStats();
  }, []);

  const total = you + codex;
  if (total === 0) return null;

  const youPct = (you / total) * 360;

  const radius = 50;
  const cx = 60;
  const cy = 60;

  const polarToCartesian = (r: number, angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180.0;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (r: number, start: number, end: number) => {
    const startPt = polarToCartesian(r, end);
    const endPt = polarToCartesian(r, start);
    const large = end - start <= 180 ? '0' : '1';
    return `M ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${large} 0 ${endPt.x} ${endPt.y}`;
  };

  return (
    <div className="fixed top-24 right-4 z-40 pointer-events-auto">
      <div className="relative w-28 h-28">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="text-cyan-400/60"
        >
          <path
            d={describeArc(radius, 0, youPct)}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="pulse-glow"
          />
          <path
            d={describeArc(radius, youPct, 360)}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="8"
            fill="none"
            className="pulse-glow"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-xs font-mono text-cyan-200">
          <span className="digital-glow">You {Math.round((you / total) * 100)}%</span>
          <span className="text-[10px] mt-1">Codex {codex}</span>
        </div>
      </div>
    </div>
  );
}
