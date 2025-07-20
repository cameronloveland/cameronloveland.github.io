import { useEffect, useState } from "react";

interface HoverState {
  eventHandlers: {
    onPointerOver: () => void;
    onPointerOut: () => void;
    onPointerMove: (e: PointerEvent) => void;
  };
  progress: number;
  position: { x: number; y: number };
  isHovering: boolean;
  completed: boolean;
}

export default function useHoverScan(duration = 2000): HoverState {
  const [isHovering, setHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let raf: number;
    if (isHovering) {
      const start = performance.now();
      const loop = (now: number) => {
        const pct = Math.min((now - start) / duration, 1);
        setProgress(pct * 100);
        if (pct < 1) {
          raf = requestAnimationFrame(loop);
        } else {
          setCompleted(true);
        }
      };
      raf = requestAnimationFrame(loop);
    } else {
      setProgress(0);
      setCompleted(false);
    }
    return () => cancelAnimationFrame(raf);
  }, [isHovering, duration]);

  const onPointerOver = () => setHovering(true);
  const onPointerOut = () => setHovering(false);
  const onPointerMove = (e: PointerEvent) => {
    setPosition({ x: e.clientX + 16, y: e.clientY + 16 });
  };

  return {
    eventHandlers: { onPointerOver, onPointerOut, onPointerMove },
    progress,
    position,
    isHovering,
    completed,
  };
}
