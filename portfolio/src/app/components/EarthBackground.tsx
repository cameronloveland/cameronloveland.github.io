'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Star {
  id: number;
  left: string;
  top: string;
  delay: string;
}

export default function EarthBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const earthRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const generated: Star[] = [];
    for (let i = 0; i < 200; i++) {
      generated.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
      });
    }
    setStars(generated);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    if (earthRef.current) {
      earthRef.current.style.transform = `translateX(${x * 25}%)`;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden" onMouseMove={handleMouseMove}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute w-[2px] h-[2px] bg-white rounded-full opacity-80 animate-pulse"
            style={{ left: s.left, top: s.top, animationDelay: s.delay, animationDuration: '2s' }}
          />
        ))}
      </div>

    </div>
  );
}
