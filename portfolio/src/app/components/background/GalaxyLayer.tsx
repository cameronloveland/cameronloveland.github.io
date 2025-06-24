import React from 'react';

export default function GalaxyLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[-2]">
      <svg
        className="absolute left-1/2 top-1/3 w-[60vw] h-[60vw] -translate-x-1/2 -translate-y-1/2 opacity-30 animate-galaxyRotate"
        viewBox="0 0 400 400"
        fill="none"
      >
        <defs>
          <radialGradient id="galaxy" r="0.9" cx="0.5" cy="0.5">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
