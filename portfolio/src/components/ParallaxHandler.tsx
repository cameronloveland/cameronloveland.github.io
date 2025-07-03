'use client';

import React from 'react';

export default function ParallaxHandler({ children }: { children: React.ReactNode }) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = (e.clientX / window.innerWidth - 0.5) * -2;
    const y = (e.clientY / window.innerHeight - 0.5) * -2;
    document.dispatchEvent(new CustomEvent('earthParallax', { detail: { x, y } }));
  };

  return (
    <div className="relative min-h-screen flex flex-col" onMouseMove={handleMouseMove}>
      {children}
    </div>
  );
}
