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
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const earthRef = useRef<HTMLImageElement>(null);

  // Generate stars on mount
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

  // Mouse movement for parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setOffset({ x, y });

    // Earth ref movement (optional)
    if (earthRef.current) {
      earthRef.current.style.transform = `translate(${x * 25}%, ${y * 15}%)`;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-0" onMouseMove={handleMouseMove}>
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          transform: `translate(${offset.x * 10}px, ${offset.y * 10}px)`,
          transition: 'transform 0.05s linear',
        }}
      >
        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute w-[2px] h-[2px] bg-white rounded-full opacity-80 animate-pulse"
            style={{
              left: s.left,
              top: s.top,
              animationDelay: s.delay,
              animationDuration: '2s',
            }}
          />
        ))}
      </div>

      {/* Optional earth layer can go here, using ref={earthRef} */}
      {/* <img ref={earthRef} src="/earth.png" alt="Earth" className="absolute bottom-0 left-1/2 transform -translate-x-1/2" /> */}
    </div>
  );
}
