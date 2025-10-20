"use client";
import Image from "next/image";
import { useRef, useState } from "react";

export default function AstronautInteractive() {
  const [isPressed, setIsPressed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePressStart = () => {
    setIsPressed(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="select-none inline-block"
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressEnd}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Image
        src="/worried-astronaut.png"
        // src={isPressed ? "/toasted-astronaut.png" : "/worried-astronaut.png"}
        alt="Interactive Astronaut"
        width={220}
        height={220}
        draggable={false}
        className={`${isPressed ? "animate-burnUp" : ""} pointer-events-none`}
      />
      <audio ref={audioRef} src="/sizzle.mp3" preload="auto" />
    </div>
  );
}
