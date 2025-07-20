"use client";
import React from "react";

interface Props {
  visible: boolean;
}

export default function RingOverlay({ visible }: Props) {
  if (!visible) return null;
  const ticks = Array.from({ length: 36 });
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-40">
      <svg viewBox="0 0 100 100" className="w-64 h-64 text-accent">
        <g transform="translate(50 50)">
          <circle cx="0" cy="0" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-70" />
          {ticks.map((_, i) => (
            <line key={i} x1="0" y1="-45" x2="0" y2="-41" stroke="currentColor" strokeWidth="0.5" transform={`rotate(${i * 10})`} />
          ))}
          <line x1="0" y1="-45" x2="0" y2="-60" stroke="currentColor" strokeWidth="0.5" />
          <text x="0" y="-65" fontSize="5" fill="currentColor" textAnchor="middle">
            Earth
          </text>
        </g>
      </svg>
    </div>
  );
}
