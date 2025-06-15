'use client';

import React, { JSX, useEffect, useRef, useState } from 'react';
import SpinningEarth from './SpinningEarth';

interface Star {
  id: number;
  left: string;
  top: string;
  delay: string;
  layer: number;
  color: string;
}

export default function EarthBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const earthRef = useRef<HTMLImageElement>(null);
  const [shootingStars, setShootingStars] = useState<JSX.Element[]>([]);

  // Generate stars on mount
  useEffect(() => {
    const generated: Star[] = [];
    const layers = 3;
    const starsPerLayer = 70;
    const colors = ["#ffffff", "#aaddff", "#ffd1a4", "#c9b3ff", "#99e0ff", "#ffeedd"];

    for (let layer = 1; layer <= layers; layer++) {
      for (let i = 0; i < starsPerLayer; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        generated.push({
          id: layer * 1000 + i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          delay: `${Math.random() * 5}s`,
          layer,
          color,
        });
      }
    }
    setStars(generated);
  }, []);

  // Generate shooting stars every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.random() * window.innerWidth;
      const top = Math.random() * window.innerHeight;

      const duration = 1 + Math.random() * 0.5;

      const star = (
        <div
          key={Math.random()}
          className="shooting-star"
          style={{
            left: `${left}px`,
            top: `${top}px`,
            animationDuration: `${duration}s`,
          }}
        />
      );

      setShootingStars((prev) => [...prev.slice(-1), star]); // limit to last 4 stars
    }, 10000 + Math.random() * 10000); // new shooting star every 0s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handle = (e: CustomEvent) => {
      const { x, y } = e.detail;
      setOffset({ x, y });
      if (earthRef.current) {
        earthRef.current.style.transform = `translate(${x * 25}%, ${y * 15}%)`;
      }
    };

    document.addEventListener("earthParallax", handle as EventListener);

    return () => document.removeEventListener("earthParallax", handle as EventListener);
  }, []);

  // Mouse movement for parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = (e.clientX / window.innerWidth - 0.5) * -2; // ← inverted
    const y = (e.clientY / window.innerHeight - 0.5) * -2; // ← inverted
    setOffset({ x, y });

    if (earthRef.current) {
      earthRef.current.style.transform = `translate(${x * 25}%, ${y * 15}%)`;
    }
  };

  return (
    <div onMouseMove={handleMouseMove}>
      <div className="fixed inset-0 overflow-hidden z-0">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            transform: `translate(${offset.x * 10}px, ${offset.y * 10}px)`,
            transition: 'transform 0.05s linear',
          }}
        >
          {[1, 2, 3].map((layer) => (
            <div
              key={layer}
              className="absolute inset-0"
              style={{
                transform: `translate(${offset.x * (10 / layer)}px, ${offset.y * (10 / layer)}px)`,
                transition: 'transform 0.05s linear',
              }}
            >
              {stars
                .filter((s) => s.layer === layer)
                .map((s) => (
                  <div
                    key={s.id}
                    className="absolute rounded-full"
                    style={{
                      left: s.left,
                      top: s.top,
                      backgroundColor: s.color,
                      width: `${0.5 + Math.random() * (2 / layer)}px`,
                      height: `${0.5 + Math.random() * (2 / layer)}px`,
                      opacity: 0.2 + Math.random() * (1 / layer),
                      animationName: 'twinkle',
                      animationDuration: `${1.5 + Math.random() * 2.5}s`,
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                      animationDelay: s.delay,
                    }}
                  />
                ))}
            </div>
          ))}

        </div>
        <SpinningEarth offset={{ x: offset.x * 0.05, y: offset.y * 0.05 }} />
        {shootingStars}
      </div >
    </div>
  );
}
