'use client';

import React, { useEffect, useRef, useState } from 'react';
import Comets from './Comets';
import ShootingStars from './ShootingStars';
import { SpinningEarth } from './Earth';

interface Star {
  id: number;
  left: string;
  top: string;
  delay: string;
  layer: number;
  color: string;
}

interface SpaceBackgroundProps {
  comets?: number;
  starLayers?: number;
  starsPerLayer?: number;
  shootingStars?: number;
}

export default function SpaceBackground({ comets = 10, starLayers = 3, starsPerLayer = 100,
  shootingStars = 10 }: SpaceBackgroundProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const earthRef = useRef<HTMLImageElement>(null);

  // Generate stars on mount
  useEffect(() => {
    const generated: Star[] = [];

    const colors = ["#ffffff", "#aaddff", "#ffd1a4", "#c9b3ff", "#99e0ff", "#ffeedd"];

    for (let layer = 1; layer <= starLayers; layer++) {
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
  }, [starLayers, starsPerLayer]);


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
      <div className="fixed inset-0 overflow-hidden z-0 animate-fade-slide-up">
        <Comets count={comets} />
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            transform: `translate(${offset.x * 10}px, ${offset.y * 10}px)`,
            transition: 'transform 0.05s linear',
          }}
        >
          {[...Array(starLayers)].map((_, layer) => (
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
                      opacity: 0.5 + Math.random() * (0.1 / layer), // higher min opacity, less range
                      animationName: 'twinkle',
                      animationDuration: `${1 + Math.random() * 2}s`, // slower twinkle
                      animationTimingFunction: 'ease-in',
                      animationIterationCount: 'infinite',
                      animationDelay: s.delay,
                    }}
                  />
                ))}
            </div>
          ))}

        </div>
        <SpinningEarth offset={{ x: offset.x * 0.05, y: offset.y * 0.05 }} />
        <ShootingStars count={shootingStars} />
      </div >
    </div >
  );
}
