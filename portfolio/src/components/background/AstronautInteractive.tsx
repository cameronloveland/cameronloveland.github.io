"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function AstronautInteractive() {
  const [isPressed, setIsPressed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePressStart = () => {
    setIsPressed(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handlePressEnd = () => {
    setIsPressed(false);
  };

  return (
    <div
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      className="inline-block select-none"
    >
      <Image
        src="/worried-astronaut.png"
        // src={isPressed ? "/astronaut-toasted.png" : "/worried-astronaut.png"}
        alt="Interactive Astronaut"
        width={220}
        height={220}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        className={`${isPressed ? "animate-burnUp" : ""}`}
      />
      <audio ref={audioRef} src="/sizzle.mp3" preload="auto" />
    </div>
  );
}
