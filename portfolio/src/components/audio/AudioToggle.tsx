"use client";
import { useEffect, useRef, useState } from "react";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import HoverSoundGlobal from "./EnableHoverSound";

export default function AudioToggle() {
  const [enabled, setEnabled] = useState(true);
  const ambientRef = useRef<HTMLAudioElement>(null);
  const voiceRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!ambientRef.current) return;

    ambientRef.current.volume = 0.2;
    ambientRef.current.loop = true;

    if (enabled) {
      // Try to play audio, but don't throw errors if it fails due to autoplay policy
      ambientRef.current.play().catch((error) => {
        console.log('Audio autoplay blocked:', error.message);
      });
    } else {
      ambientRef.current.pause();
    }
  }, [enabled]);

  const handleToggle = () => {
    console.log('Audio toggle clicked, current state:', enabled);
    setEnabled((prev: boolean) => !prev);
  };

  return (
    <>
      <button
        onClick={handleToggle}
        title="Toggle audio"
        className={`hover-sound button-style cursor-pointer p-2 rounded-lg transition-all duration-200 ${enabled ? 'text-cyan-300' : 'text-neutral-400'
          }`}
      >
        {enabled ? <HiSpeakerWave className="text-xl" /> : <HiSpeakerXMark className="text-xl" />}
      </button>
      <audio ref={ambientRef} src="/sfx/spaceship-ambience.mp3" preload="auto" />
      <HoverSoundGlobal enabled={enabled} />
    </>
  );
}
