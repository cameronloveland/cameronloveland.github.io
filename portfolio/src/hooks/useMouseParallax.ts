'use client';

import { useEffect, useState } from 'react';

export default function useMouseParallax(intensity: number = 5) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e: CustomEvent<{ x: number; y: number }>) => {
      setOffset({ x: e.detail.x * intensity, y: e.detail.y * intensity });
    };

    document.addEventListener('earthParallax', handle as EventListener);
    return () => document.removeEventListener('earthParallax', handle as EventListener);
  }, [intensity]);

  return offset;
}
