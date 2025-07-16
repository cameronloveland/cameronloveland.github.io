import React, { useEffect, useState, JSX } from 'react';
import { useCosmicControl } from '@/lib/useCosmicControl';

/**
 * ShootingStars component
 * @param maxActive - Maximum number of shooting stars visible at once (default: 6)
 */
export default function ShootingStars({ maxActive = 4 }: { maxActive?: number }) {
  const { shootingStarsEnabled } = useCosmicControl();
  const [shootingStars, setShootingStars] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!shootingStarsEnabled) return;
    let timeoutId: number;
    function spawnStar() {
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
      setShootingStars((prev) => [...prev.slice(-(maxActive - 1)), star]);
      // Schedule next star with a random delay (1-3 seconds)
      timeoutId = window.setTimeout(spawnStar, 1000 + Math.random() * 2000);
    }
    spawnStar();
    return () => clearTimeout(timeoutId);
  }, [maxActive, shootingStarsEnabled]);

  if (!shootingStarsEnabled) return null;

  return <>{shootingStars}</>;
} 