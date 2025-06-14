'use client';

import React, { useEffect, useState } from 'react';

export default function Header() {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [fillCount, setFillCount] = useState(0);
  const [offset, setOffset] = useState(0);

  // Alternate title every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowPortfolio((p) => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Mouse move listener for fill count and offset
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const width = window.innerWidth;
      const x = e.clientX;
      const ratio = 1 - x / width; // left -> 1, right -> 0
      setFillCount(Math.min(10, Math.max(0, Math.round(ratio * 10))));

      const range = 10; // max offset in px
      setOffset((x / width - 0.5) * range * 2);
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <span className="text-white font-bold text-lg tracking-tight select-none">
        {showPortfolio ? 'Portfolio' : 'Cameron Loveland'}
      </span>
      <div
        className="flex gap-0.5 h-4"
        style={{ transform: `translateX(${offset}px)` }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-full bg-neutral-700 opacity-40 transition-all border border-neutral-600 ${
              fillCount > i
                ? 'bg-teal-500 opacity-100 shadow-[0_0_4px_1px_rgba(13,148,136,0.8)]'
                : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
}
